import { UpperCasePipe } from '@angular/common';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { ChangeDetectionStrategy, Component, effect, inject, viewChild } from '@angular/core';
import { CdkVirtualScrollViewport } from '@angular/cdk/scrolling';
import { Store } from '@ngrx/store';

import type { Order } from '../../shared/models/order.model';
import { formatSymbolLabel } from '../../shared/utils/symbol-format';
import { selectAllOrders } from '../../state/orders/orders.selectors';

@Component({
  selector: 'app-order-history-list',
  imports: [ScrollingModule, UpperCasePipe],
  templateUrl: './order-history-list.component.html',
  styleUrl: './order-history-list.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OrderHistoryListComponent {
  private readonly store = inject(Store);
  private readonly viewport = viewChild(CdkVirtualScrollViewport);

  readonly orders = this.store.selectSignal(selectAllOrders);
  private previousCount = 0;

  constructor() {
    effect(() => {
      const count = this.orders().length;
      const vp = this.viewport();
      if (!vp || count === 0) {
        this.previousCount = count;
        return;
      }

      const atTop = vp.measureScrollOffset('top') < 4;
      if (count > this.previousCount && atTop) {
        queueMicrotask(() => vp.scrollToIndex(0));
      }
      this.previousCount = count;
    });
  }

  trackById(_index: number, order: Order): string {
    return order.id;
  }

  formatSymbol(symbol: string): string {
    return formatSymbolLabel(symbol);
  }

  formatTime(epochMs: number): string {
    return new Date(epochMs).toLocaleString();
  }
}
