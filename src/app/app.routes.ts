import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'market-watch' },
  {
    path: 'market-watch',
    loadComponent: () => import('./features/market-watch/market-watch.component'),
    title: 'Market Watch',
  },
  {
    path: 'order-placement',
    loadComponent: () => import('./features/order-placement/order-placement.component'),
    title: 'Order Placement',
  },
  {
    path: 'order-book',
    loadComponent: () => import('./features/order-book/order-book.component'),
    title: 'Order Book',
  },
  {
    path: 'portfolio',
    loadComponent: () => import('./features/portfolio/portfolio.component'),
    title: 'Portfolio',
  },
  {
    path: 'charts',
    loadComponent: () => import('./features/charts/charts.component'),
    title: 'Charts',
  },
  {
    path: 'order-history',
    loadComponent: () => import('./features/order-history/order-history.component'),
    title: 'Order History',
  },
  { path: '**', redirectTo: 'market-watch' },
];
