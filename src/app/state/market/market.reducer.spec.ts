import { marketReducer, initialMarketState } from './market.reducer';
import { MarketActions } from './market.actions';

describe('marketReducer', () => {
  it('updates price and preserves prevPrice', () => {
    const state = marketReducer(
      initialMarketState,
      MarketActions.priceUpdated({
        symbol: 'BTCUSDT',
        update: { price: 100, changePct: 1.2, volume: 500, lastUpdated: 1 },
      }),
    );

    expect(state.symbols['BTCUSDT']?.price).toBe(100);
    expect(state.symbols['BTCUSDT']?.prevPrice).toBe(100);
  });

  it('sets prevPrice from previous tick', () => {
    const withFirst = marketReducer(
      initialMarketState,
      MarketActions.priceUpdated({
        symbol: 'BTCUSDT',
        update: { price: 100, changePct: 0, volume: 1, lastUpdated: 1 },
      }),
    );
    const withSecond = marketReducer(
      withFirst,
      MarketActions.priceUpdated({
        symbol: 'BTCUSDT',
        update: { price: 110, changePct: 10, volume: 2, lastUpdated: 2 },
      }),
    );

    expect(withSecond.symbols['BTCUSDT']?.price).toBe(110);
    expect(withSecond.symbols['BTCUSDT']?.prevPrice).toBe(100);
  });
});
