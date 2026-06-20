import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-market-watch',
  standalone: true,
  template: `
    <section class="feature">
      <h1>Market Watch</h1>
      <p>Live watchlist — WebSocket feed lands in Phase 2.</p>
    </section>
  `,
  styles: `
    .feature {
      padding: 1.5rem;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class MarketWatchComponent {}
