import { ChangeDetectionStrategy, Component, DestroyRef, inject, OnInit } from '@angular/core';
import { takeUntilDestroyed, toObservable, toSignal } from '@angular/core/rxjs-interop';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { Store } from '@ngrx/store';
import { switchMap } from 'rxjs';

import { WATCHLIST_SYMBOLS } from '../../core/market-data/market.constants';
import { MarketActions } from '../../state/market/market.actions';
import { selectDepthForSymbol, selectSelectedSymbol } from '../../state/market/market.selectors';

@Component({
  selector: 'app-order-book',
  imports: [ReactiveFormsModule],
  templateUrl: './order-book.component.html',
  styleUrl: './order-book.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class OrderBookComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly store = inject(Store);
  private readonly destroyRef = inject(DestroyRef);

  readonly symbols = WATCHLIST_SYMBOLS;
  readonly symbolControl = this.fb.nonNullable.control('BTCUSDT');

  readonly selectedSymbol = this.store.selectSignal(selectSelectedSymbol);
  readonly depth = toSignal(
    toObservable(this.selectedSymbol).pipe(
      switchMap((symbol) => this.store.select(selectDepthForSymbol(symbol))),
    ),
    { initialValue: undefined },
  );

  ngOnInit(): void {
    this.symbolControl.setValue(this.selectedSymbol(), { emitEvent: false });
    this.store.dispatch(MarketActions.connectDepth());

    this.symbolControl.valueChanges
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((symbol) => {
        this.store.dispatch(MarketActions.symbolSelected({ symbol }));
      });

    this.destroyRef.onDestroy(() => {
      this.store.dispatch(MarketActions.disconnectDepth());
    });
  }

  formatSymbol(symbol: string): string {
    return symbol.replace('USDT', '/USDT');
  }

  formatPrice(price: number): string {
    return price >= 100 ? price.toFixed(2) : price.toFixed(4);
  }

  formatQty(qty: number): string {
    return qty.toFixed(4);
  }
}
