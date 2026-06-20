import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { map } from 'rxjs';

import { MarketActions } from './market.actions';

/** Placeholder effect — live WebSocket wiring lands in Phase 2. */
@Injectable()
export class MarketEffects {
  private readonly actions$ = inject(Actions);

  connect$ = createEffect(() =>
    this.actions$.pipe(
      ofType(MarketActions.connect),
      map(() => MarketActions.statusChanged({ status: 'connecting' })),
    ),
  );
}
