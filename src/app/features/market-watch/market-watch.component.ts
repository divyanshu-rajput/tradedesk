import { ChangeDetectionStrategy, Component, DestroyRef, inject, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { isDevMode } from '@angular/core';

import { WATCHLIST_SYMBOLS } from '../../core/market-data/market.constants';
import { MarketActions } from '../../state/market/market.actions';
import { ConnectionStatusComponent } from './connection-status.component';
import { WatchlistTableComponent } from './watchlist-table.component';

@Component({
  selector: 'app-market-watch',
  standalone: true,
  imports: [ConnectionStatusComponent, WatchlistTableComponent],
  template: `
    <section class="market-watch">
      <header class="market-watch__header">
        <div>
          <h1>Market Watch</h1>
          <p class="market-watch__hint">
            Live prices for {{ symbolCount }} symbols — only the updated row re-renders.
          </p>
        </div>
        <app-connection-status />
      </header>

      <app-watchlist-table />

      @if (devMode) {
        <p class="market-watch__dev">
          Dev mode: render-count column visible per row (Angular DevTools / profiler).
        </p>
      }
    </section>
  `,
  styles: `
    .market-watch {
      padding: 1.5rem;
    }

    .market-watch__header {
      display: flex;
      align-items: flex-start;
      justify-content: space-between;
      gap: 1rem;
      margin-bottom: 1rem;
    }

    h1 {
      margin: 0 0 0.25rem;
      font-size: 1.5rem;
    }

    .market-watch__hint {
      margin: 0;
      color: #94a3b8;
      font-size: 0.875rem;
    }

    .market-watch__dev {
      margin-top: 1rem;
      font-size: 0.75rem;
      color: #64748b;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class MarketWatchComponent implements OnInit {
  private readonly store = inject(Store);
  private readonly destroyRef = inject(DestroyRef);

  readonly symbolCount = WATCHLIST_SYMBOLS.length;
  readonly devMode = isDevMode();

  ngOnInit(): void {
    this.store.dispatch(MarketActions.connect());

    this.destroyRef.onDestroy(() => {
      this.store.dispatch(MarketActions.disconnect());
    });
  }
}
