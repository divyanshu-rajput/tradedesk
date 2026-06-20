import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';

import { OrdersActions } from '../../state/orders/orders.actions';
import { selectAllOrders } from '../../state/orders/orders.selectors';
import { OrderHistoryListComponent } from './order-history-list.component';

@Component({
  selector: 'app-order-history',
  imports: [OrderHistoryListComponent],
  templateUrl: './order-history.component.html',
  styleUrl: './order-history.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class OrderHistoryComponent implements OnInit {
  private readonly store = inject(Store);

  readonly orderCount = this.store.selectSignal(selectAllOrders);

  ngOnInit(): void {
    if (this.orderCount().length === 0) {
      this.store.dispatch(OrdersActions.loadOrders());
    }
  }
}
