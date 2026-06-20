import { ChangeDetectionStrategy, Component, effect, inject, input, signal } from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { isDevMode } from '@angular/core';
import { Store } from '@ngrx/store';
import { switchMap } from 'rxjs';

import { PriceFlashDirective } from '../../shared/directives/price-flash.directive';
import type { SymbolTick } from '../../state/market/market.reducer';
import { selectSymbolData } from '../../state/market/market.selectors';

@Component({
  selector: 'app-watchlist-row',
  standalone: true,
  imports: [PriceFlashDirective],
  template: `
    <tr class="row">
      <td class="row__symbol">{{ displaySymbol() }}</td>
      <td class="row__price" [priceFlash]="tick()?.price ?? null">
        {{ formatPrice(tick()?.price) }}
      </td>
      <td
        class="row__change"
        [class.row__change--up]="(tick()?.changePct ?? 0) >= 0"
        [class.row__change--down]="(tick()?.changePct ?? 0) < 0"
      >
        {{ formatChange(tick()?.changePct) }}
      </td>
      <td class="row__volume">{{ formatVolume(tick()?.volume) }}</td>
      @if (showRenderCount()) {
        <td class="row__debug">{{ renderCount() }}</td>
      }
    </tr>
  `,
  styles: `
    .row td {
      padding: 0.625rem 0.75rem;
      border-bottom: 1px solid #1e293b;
      font-variant-numeric: tabular-nums;
    }

    .row__symbol {
      font-weight: 600;
      color: #f8fafc;
    }

    .row__price {
      color: #e2e8f0;
    }

    .row__change--up {
      color: #4ade80;
    }

    .row__change--down {
      color: #f87171;
    }

    .row__volume {
      color: #94a3b8;
    }

    .row__debug {
      color: #64748b;
      font-size: 0.75rem;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WatchlistRowComponent {
  private readonly store = inject(Store);

  readonly symbol = input.required<string>();
  readonly tick = toSignal(
    toObservable(this.symbol).pipe(switchMap((sym) => this.store.select(selectSymbolData(sym)))),
    { initialValue: undefined as SymbolTick | undefined },
  );
  readonly renderCount = signal(0);
  readonly showRenderCount = signal(isDevMode());

  constructor() {
    effect(() => {
      this.tick();
      this.renderCount.update((count) => count + 1);
    });
  }

  displaySymbol(): string {
    return this.symbol().replace('USDT', '/USDT');
  }

  formatPrice(price: number | undefined): string {
    if (price == null) {
      return '—';
    }
    return price >= 100 ? price.toFixed(2) : price.toFixed(4);
  }

  formatChange(changePct: number | undefined): string {
    if (changePct == null) {
      return '—';
    }
    const sign = changePct >= 0 ? '+' : '';
    return `${sign}${changePct.toFixed(2)}%`;
  }

  formatVolume(volume: number | undefined): string {
    if (volume == null) {
      return '—';
    }
    if (volume >= 1_000_000) {
      return `${(volume / 1_000_000).toFixed(2)}M`;
    }
    if (volume >= 1_000) {
      return `${(volume / 1_000).toFixed(1)}K`;
    }
    return volume.toFixed(0);
  }
}
