import { createFeatureSelector, createSelector } from '@ngrx/store';

import { formatSymbolLabel } from '../../shared/utils/symbol-format';
import { selectMarketState } from '../market/market.selectors';
import type { PortfolioState } from './portfolio.reducer';

export const selectPortfolioState = createFeatureSelector<PortfolioState>('portfolio');

export const selectHoldings = createSelector(selectPortfolioState, (state) => state.holdings);

export const selectCash = createSelector(selectPortfolioState, (state) => state.cash);

export interface HoldingWithPnl {
  symbol: string;
  qty: number;
  avgCost: number;
  currentPrice: number;
  marketValue: number;
  pnl: number;
  pnlPct: number;
}

/** Cross-slice P&L — computed from live market prices, never stored. */
export const selectHoldingsWithPnl = createSelector(
  selectHoldings,
  selectMarketState,
  (holdings, market): HoldingWithPnl[] =>
    holdings.map((h) => {
      const tick = market.symbols[h.symbol];
      const currentPrice = tick?.price ?? h.avgCost;
      const marketValue = currentPrice * h.qty;
      const costBasis = h.avgCost * h.qty;
      const pnl = marketValue - costBasis;
      const pnlPct = costBasis > 0 ? (pnl / costBasis) * 100 : 0;

      return {
        ...h,
        currentPrice,
        marketValue,
        pnl,
        pnlPct,
      };
    }),
);

export const selectTotalPortfolioValue = createSelector(
  selectHoldingsWithPnl,
  selectCash,
  (holdings, cash) => cash + holdings.reduce((sum, h) => sum + h.marketValue, 0),
);

export const selectTotalPnl = createSelector(selectHoldingsWithPnl, (holdings) =>
  holdings.reduce((sum, h) => sum + h.pnl, 0),
);

export interface AllocationSlice {
  symbol: string;
  label: string;
  value: number;
}

export const selectAllocation = createSelector(
  selectHoldingsWithPnl,
  selectCash,
  (holdings, cash): AllocationSlice[] => {
    const slices: AllocationSlice[] = holdings.map((h) => ({
      symbol: h.symbol,
      label: formatSymbolLabel(h.symbol),
      value: h.marketValue,
    }));

    if (cash > 0) {
      slices.push({ symbol: 'CASH', label: 'Cash', value: cash });
    }

    return slices.filter((slice) => slice.value > 0);
  },
);

/** @deprecated Use selectHoldingsWithPnl — kept for backward-compatible tests. */
export const selectPnl = createSelector(selectHoldingsWithPnl, (holdings) =>
  holdings.map((h) => ({
    symbol: h.symbol,
    qty: h.qty,
    pnl: h.pnl,
  })),
);
