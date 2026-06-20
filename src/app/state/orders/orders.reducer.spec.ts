import { OrdersActions } from './orders.actions';
import { initialOrdersState, ordersReducer } from './orders.reducer';

describe('ordersReducer', () => {
  it('adds order on orderPlaced', () => {
    const order = {
      id: '1',
      symbol: 'BTCUSDT',
      side: 'buy' as const,
      type: 'market' as const,
      qty: 0.1,
      status: 'simulated' as const,
      createdAt: 100,
    };

    const state = ordersReducer(
      { ...initialOrdersState, submitting: true },
      OrdersActions.orderPlaced({ order }),
    );

    expect(state.submitting).toBe(false);
    expect(state.ids).toEqual(['1']);
    expect(state.entities['1']).toEqual(order);
  });

  it('stores error on orderFailed', () => {
    const state = ordersReducer(
      { ...initialOrdersState, submitting: true },
      OrdersActions.orderFailed({ error: 'Network error' }),
    );

    expect(state.submitting).toBe(false);
    expect(state.lastError).toBe('Network error');
  });
});
