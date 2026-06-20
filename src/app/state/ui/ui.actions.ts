import { createActionGroup, props } from '@ngrx/store';

export type FeedMode = 'live' | 'demo';
export type Theme = 'dark' | 'light';

export const UiActions = createActionGroup({
  source: 'UI',
  events: {
    'Route Changed': props<{ route: string }>(),
    'Theme Changed': props<{ theme: Theme }>(),
    'Feed Mode Changed': props<{ mode: FeedMode }>(),
    'Loading Changed': props<{ key: string; loading: boolean }>(),
  },
});
