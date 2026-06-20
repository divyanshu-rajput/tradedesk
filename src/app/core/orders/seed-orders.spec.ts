import { generateSeedOrders } from './seed-orders';

describe('generateSeedOrders', () => {
  it('creates the requested number of deterministic orders', () => {
    const orders = generateSeedOrders(1_000);
    expect(orders).toHaveLength(1_000);
    expect(orders[0]?.id).toBe('seed-00000');
    expect(orders[999]?.id).toBe('seed-00999');
  });
});
