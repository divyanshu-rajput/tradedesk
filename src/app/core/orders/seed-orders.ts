import { WATCHLIST_SYMBOLS } from '../market-data/market.constants';
import type { Order, OrderSide, OrderType } from '../../shared/models/order.model';

const ORDER_TYPES: OrderType[] = ['market', 'limit', 'stop-loss'];
const SIDES: OrderSide[] = ['buy', 'sell'];

/** Deterministic pseudo-random for reproducible seed data. */
function seededRandom(seed: number): number {
  const x = Math.sin(seed) * 10_000;
  return x - Math.floor(x);
}

export function generateSeedOrders(count: number): Order[] {
  const now = Date.now();
  const orders: Order[] = [];

  for (let i = 0; i < count; i += 1) {
    const symbol = WATCHLIST_SYMBOLS[i % WATCHLIST_SYMBOLS.length];
    const type = ORDER_TYPES[i % ORDER_TYPES.length];
    const side = SIDES[i % SIDES.length];
    const qty = Number((0.01 + seededRandom(i + 1) * 2).toFixed(4));

    orders.push({
      id: `seed-${i.toString().padStart(5, '0')}`,
      symbol,
      side,
      type,
      qty,
      ...(type === 'limit'
        ? { limitPrice: Number((100 + seededRandom(i + 2) * 500).toFixed(2)) }
        : {}),
      ...(type === 'stop-loss'
        ? { stopPrice: Number((100 + seededRandom(i + 3) * 500).toFixed(2)) }
        : {}),
      status: 'simulated',
      createdAt: now - i * 60_000,
    });
  }

  return orders;
}
