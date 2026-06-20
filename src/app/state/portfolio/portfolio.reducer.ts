import { createReducer, on } from '@ngrx/store';

import { PortfolioActions } from './portfolio.actions';
import type { Holding } from '../../shared/models/holding.model';

export interface PortfolioState {
  cash: number;
  holdings: Holding[];
}

export const initialPortfolioState: PortfolioState = {
  cash: 100_000,
  holdings: [],
};

export const portfolioReducer = createReducer(
  initialPortfolioState,
  on(PortfolioActions.snapshotLoaded, (state, { cash, holdings }) => ({
    ...state,
    cash,
    holdings,
  })),
  on(PortfolioActions.updateHoldings, (state, { holdings }) => ({
    ...state,
    holdings,
  })),
);
