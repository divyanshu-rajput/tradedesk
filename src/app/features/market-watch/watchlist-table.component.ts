import { ChangeDetectionStrategy, Component } from '@angular/core';

import { WATCHLIST_SYMBOLS } from '../../core/market-data/market.constants';
import { WatchlistRowComponent } from './watchlist-row.component';

@Component({
  selector: 'app-watchlist-table',
  standalone: true,
  imports: [WatchlistRowComponent],
  template: `
    <div class="table-wrap">
      <table class="table">
        <thead>
          <tr>
            <th>Symbol</th>
            <th>Price</th>
            <th>24h %</th>
            <th>Volume</th>
          </tr>
        </thead>
        <tbody>
          @for (symbol of symbols; track symbol) {
            <app-watchlist-row [symbol]="symbol" />
          }
        </tbody>
      </table>
    </div>
  `,
  styles: `
    .table-wrap {
      overflow: auto;
      border: 1px solid #1e293b;
      border-radius: 0.5rem;
      background: #0f172a;
    }

    .table {
      width: 100%;
      border-collapse: collapse;
      font-size: 0.875rem;
    }

    th {
      text-align: left;
      padding: 0.625rem 0.75rem;
      color: #94a3b8;
      font-weight: 600;
      border-bottom: 1px solid #1e293b;
      background: #111827;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WatchlistTableComponent {
  readonly symbols = WATCHLIST_SYMBOLS;
}
