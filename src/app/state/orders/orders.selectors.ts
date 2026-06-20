import { createFeatureSelector, createSelector } from '@ngrx/store';

import type { OrdersState } from './orders.reducer';

export const selectOrdersState = createFeatureSelector<OrdersState>('orders');

export const selectAllOrders = createSelector(selectOrdersState, (state) =>
  state.ids.map((id) => state.entities[id]),
);

export const selectOrdersSubmitting = createSelector(
  selectOrdersState,
  (state) => state.submitting,
);
