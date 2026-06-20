import { createFeatureSelector, createSelector } from '@ngrx/store';

import { selectMarketState } from '../market/market.selectors';
import type { PortfolioState } from './portfolio.reducer';

export const selectPortfolioState = createFeatureSelector<PortfolioState>('portfolio');

export const selectHoldings = createSelector(selectPortfolioState, (state) => state.holdings);

export const selectCash = createSelector(selectPortfolioState, (state) => state.cash);

/** Cross-slice P&L — computed, never stored. Full logic in Phase 4. */
export const selectPnl = createSelector(selectHoldings, selectMarketState, (holdings, market) =>
  holdings.map((h) => {
    const tick = market.symbols[h.symbol];
    const currentPrice = tick?.price ?? h.avgCost;
    return {
      symbol: h.symbol,
      qty: h.qty,
      pnl: (currentPrice - h.avgCost) * h.qty,
    };
  }),
);
