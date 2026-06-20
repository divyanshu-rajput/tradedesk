import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Store } from '@ngrx/store';

import { formatSymbolLabel } from '../../shared/utils/symbol-format';
import { selectHoldingsWithPnl } from '../../state/portfolio/portfolio.selectors';

@Component({
  selector: 'app-holdings-table',
  templateUrl: './holdings-table.component.html',
  styleUrl: './holdings-table.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HoldingsTableComponent {
  private readonly store = inject(Store);

  readonly holdings = this.store.selectSignal(selectHoldingsWithPnl);

  formatSymbol(symbol: string): string {
    return formatSymbolLabel(symbol);
  }

  formatMoney(value: number): string {
    return value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  }

  formatPrice(price: number): string {
    return price >= 100 ? price.toFixed(2) : price.toFixed(4);
  }

  formatPct(pct: number): string {
    const sign = pct >= 0 ? '+' : '';
    return `${sign}${pct.toFixed(2)}%`;
  }
}
