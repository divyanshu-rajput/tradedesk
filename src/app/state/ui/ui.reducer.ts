import { createReducer, on } from '@ngrx/store';

import { UiActions } from './ui.actions';

export interface UiState {
  activeRoute: string;
  theme: 'dark' | 'light';
  feedMode: 'live' | 'demo';
  loading: Record<string, boolean>;
}

export const initialUiState: UiState = {
  activeRoute: '/',
  theme: 'dark',
  feedMode: 'live',
  loading: {},
};

export const uiReducer = createReducer(
  initialUiState,
  on(UiActions.routeChanged, (state, { route }) => ({ ...state, activeRoute: route })),
  on(UiActions.themeChanged, (state, { theme }) => ({ ...state, theme })),
  on(UiActions.feedModeChanged, (state, { mode }) => ({ ...state, feedMode: mode })),
  on(UiActions.loadingChanged, (state, { key, loading }) => ({
    ...state,
    loading: { ...state.loading, [key]: loading },
  })),
);
