import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { map } from 'rxjs/operators';

import type { Order } from '../../shared/models/order.model';
import { OrdersActions } from './orders.actions';

@Injectable()
export class OrdersEffects {
  private readonly actions$ = inject(Actions);

  /** Optimistic simulated order — persisted to Firestore in Phase 5. */
  placeOrder$ = createEffect(() =>
    this.actions$.pipe(
      ofType(OrdersActions.placeOrder),
      map(({ order }) => {
        const placed: Order = {
          ...order,
          id: crypto.randomUUID(),
          status: 'simulated',
          createdAt: Date.now(),
        };
        return OrdersActions.orderPlaced({ order: placed });
      }),
    ),
  );
}
