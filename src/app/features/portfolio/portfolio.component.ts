import { ChangeDetectionStrategy, Component, DestroyRef, inject, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';

import { MarketActions } from '../../state/market/market.actions';
import { PortfolioActions } from '../../state/portfolio/portfolio.actions';
import {
  selectAllocation,
  selectCash,
  selectTotalPnl,
  selectTotalPortfolioValue,
} from '../../state/portfolio/portfolio.selectors';
import { AllocationChartComponent } from './allocation-chart.component';
import { HoldingsTableComponent } from './holdings-table.component';

@Component({
  selector: 'app-portfolio',
  imports: [HoldingsTableComponent, AllocationChartComponent],
  templateUrl: './portfolio.component.html',
  styleUrl: './portfolio.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class PortfolioComponent implements OnInit {
  private readonly store = inject(Store);
  private readonly destroyRef = inject(DestroyRef);

  readonly cash = this.store.selectSignal(selectCash);
  readonly totalValue = this.store.selectSignal(selectTotalPortfolioValue);
  readonly totalPnl = this.store.selectSignal(selectTotalPnl);
  readonly allocation = this.store.selectSignal(selectAllocation);

  ngOnInit(): void {
    this.store.dispatch(PortfolioActions.loadSnapshot());
    this.store.dispatch(MarketActions.connect());

    this.destroyRef.onDestroy(() => {
      this.store.dispatch(MarketActions.disconnect());
    });
  }

  formatMoney(value: number): string {
    return value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  }
}
