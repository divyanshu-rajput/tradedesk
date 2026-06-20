import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { from, timer } from 'rxjs';
import { catchError, concatMap, map, switchMap, takeUntil, tap } from 'rxjs/operators';

import { MARKET_FEED } from '../../core/market-data/market-feed.token';
import { connectionBackoffMs } from '../../core/market-data/market.constants';
import { FEED_MODE } from '../../core/market-data/market-feed.providers';
import { MarketActions } from './market.actions';

@Injectable()
export class MarketEffects {
  private readonly actions$ = inject(Actions);
  private readonly store = inject(Store);
  private readonly feed = inject(MARKET_FEED);
  private readonly feedMode = inject(FEED_MODE);

  /** Dispatched when the market-watch route loads. */
  connectInit$ = createEffect(() =>
    this.actions$.pipe(
      ofType(MarketActions.connect),
      map(() =>
        MarketActions.statusChanged({
          status: this.feedMode === 'demo' ? 'demo' : 'connecting',
        }),
      ),
    ),
  );

  /** Tear down feed when leaving market-watch. */
  disconnect$ = createEffect(() =>
    this.actions$.pipe(
      ofType(MarketActions.disconnect),
      map(() => MarketActions.statusChanged({ status: 'closed' })),
    ),
  );

  /** Stream price ticks from live socket or demo feed into the store. */
  priceFeed$ = createEffect(() =>
    this.actions$.pipe(
      ofType(MarketActions.connect),
      switchMap(() => {
        const disconnect$ = this.actions$.pipe(ofType(MarketActions.disconnect));
        let opened = false;
        let retryAttempt = 0;

        return this.feed.stream$().pipe(
          tap(() => {
            retryAttempt = 0;
          }),
          concatMap((frame) => {
            const priceAction = MarketActions.priceUpdated({
              symbol: frame.symbol,
              update: {
                price: frame.price,
                changePct: frame.changePct,
                volume: frame.volume,
                lastUpdated: Date.now(),
              },
            });

            if (!opened && this.feedMode === 'live') {
              opened = true;
              return from([MarketActions.statusChanged({ status: 'open' }), priceAction]);
            }

            opened = true;
            return from([priceAction]);
          }),
          takeUntil(disconnect$),
          catchError((error, caught) => {
            retryAttempt += 1;
            this.store.dispatch(MarketActions.statusChanged({ status: 'reconnecting' }));
            const delayMs = connectionBackoffMs(retryAttempt - 1);

            if (retryAttempt > 8) {
              console.error('[MarketFeed] max reconnect attempts reached', error);
              return from([MarketActions.statusChanged({ status: 'closed' })]);
            }

            return timer(delayMs).pipe(switchMap(() => caught));
          }),
        );
      }),
    ),
  );
}
