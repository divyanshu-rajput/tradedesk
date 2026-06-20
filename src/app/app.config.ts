import { isDevMode } from '@angular/core';
import {
  ApplicationConfig,
  provideBrowserGlobalErrorListeners,
  provideZonelessChangeDetection,
} from '@angular/core';
import { provideRouter, withComponentInputBinding, withViewTransitions } from '@angular/router';
import { provideEffects } from '@ngrx/effects';
import { provideStore } from '@ngrx/store';
import { provideStoreDevtools } from '@ngrx/store-devtools';

import { provideMarketFeed } from './core/market-data/market-feed.providers';
import { routes } from './app.routes';
import {
  MarketEffects,
  OrdersEffects,
  PortfolioEffects,
  marketReducer,
  ordersReducer,
  portfolioReducer,
  uiReducer,
} from './state';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZonelessChangeDetection(),
    provideRouter(routes, withComponentInputBinding(), withViewTransitions()),
    provideStore({
      market: marketReducer,
      orders: ordersReducer,
      portfolio: portfolioReducer,
      ui: uiReducer,
    }),
    provideEffects([MarketEffects, OrdersEffects, PortfolioEffects]),
    provideStoreDevtools({
      maxAge: 25,
      logOnly: !isDevMode(),
      connectInZone: false,
    }),
    provideMarketFeed(),
  ],
};
