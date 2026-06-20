import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { map } from 'rxjs/operators';

import { SEED_CASH, SEED_HOLDINGS } from '../../core/portfolio/seed-holdings';
import { PortfolioActions } from './portfolio.actions';

@Injectable()
export class PortfolioEffects {
  private readonly actions$ = inject(Actions);

  /** Seed demo portfolio snapshot — Firestore hydration lands in Phase 5. */
  loadSnapshot$ = createEffect(() =>
    this.actions$.pipe(
      ofType(PortfolioActions.loadSnapshot),
      map(() =>
        PortfolioActions.snapshotLoaded({
          cash: SEED_CASH,
          holdings: SEED_HOLDINGS,
        }),
      ),
    ),
  );
}
