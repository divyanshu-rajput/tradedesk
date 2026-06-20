import {
  selectAllocation,
  selectHoldingsWithPnl,
  selectPnl,
  selectTotalPortfolioValue,
} from './portfolio.selectors';
import { initialMarketState } from '../market/market.reducer';
import { initialPortfolioState } from './portfolio.reducer';

describe('portfolio selectors', () => {
  const portfolio = {
    ...initialPortfolioState,
    cash: 10_000,
    holdings: [{ symbol: 'BTCUSDT', qty: 1, avgCost: 60_000 }],
  };

  const market = {
    ...initialMarketState,
    symbols: {
      BTCUSDT: {
        price: 65_000,
        prevPrice: 64_000,
        changePct: 1.2,
        volume: 100,
        lastUpdated: Date.now(),
      },
    },
  };

  it('computes cross-slice P&L from live market prices', () => {
    const pnl = selectPnl.projector(selectHoldingsWithPnl.projector(portfolio.holdings, market));

    expect(pnl).toEqual([{ symbol: 'BTCUSDT', qty: 1, pnl: 5_000 }]);
  });

  it('includes cash in allocation and total value', () => {
    const holdingsWithPnl = selectHoldingsWithPnl.projector(portfolio.holdings, market);
    const allocation = selectAllocation.projector(holdingsWithPnl, portfolio.cash);
    const total = selectTotalPortfolioValue.projector(holdingsWithPnl, portfolio.cash);

    expect(allocation).toEqual(
      expect.arrayContaining([
        { symbol: 'BTCUSDT', label: 'BTC/USDT', value: 65_000 },
        { symbol: 'CASH', label: 'Cash', value: 10_000 },
      ]),
    );
    expect(total).toBe(75_000);
  });
});
