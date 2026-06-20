import { createFeatureSelector, createSelector } from '@ngrx/store';

import type { MarketState } from './market.reducer';

export const selectMarketState = createFeatureSelector<MarketState>('market');

export const selectConnectionStatus = createSelector(
  selectMarketState,
  (state) => state.connectionStatus,
);

export const selectSelectedSymbol = createSelector(
  selectMarketState,
  (state) => state.selectedSymbol,
);

export const selectSymbolData = (symbol: string) =>
  createSelector(selectMarketState, (state) => state.symbols[symbol]);

export const selectAllSymbols = createSelector(selectMarketState, (state) =>
  Object.keys(state.symbols),
);
