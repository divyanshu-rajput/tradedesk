import { createFeatureSelector, createSelector } from '@ngrx/store';

import type { UiState } from './ui.reducer';

export const selectUiState = createFeatureSelector<UiState>('ui');

export const selectTheme = createSelector(selectUiState, (state) => state.theme);

export const selectFeedMode = createSelector(selectUiState, (state) => state.feedMode);

export const selectActiveRoute = createSelector(selectUiState, (state) => state.activeRoute);
