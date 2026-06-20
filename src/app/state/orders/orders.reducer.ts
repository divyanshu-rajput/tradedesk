import { createReducer, on } from '@ngrx/store';

import { OrdersActions } from './orders.actions';
import type { Order } from '../../shared/models/order.model';

export interface OrdersState {
  entities: Record<string, Order>;
  ids: string[];
  submitting: boolean;
  lastError: string | null;
}

export const initialOrdersState: OrdersState = {
  entities: {},
  ids: [],
  submitting: false,
  lastError: null,
};

export const ordersReducer = createReducer(
  initialOrdersState,
  on(OrdersActions.placeOrder, (state) => ({
    ...state,
    submitting: true,
    lastError: null,
  })),
  on(OrdersActions.orderPlaced, (state, { order }) => ({
    ...state,
    submitting: false,
    entities: { ...state.entities, [order.id]: order },
    ids: [order.id, ...state.ids],
  })),
  on(OrdersActions.orderFailed, (state, { error }) => ({
    ...state,
    submitting: false,
    lastError: error,
  })),
);
