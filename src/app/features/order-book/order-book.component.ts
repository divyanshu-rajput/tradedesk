import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-order-book',
  standalone: true,
  template: `
    <section class="feature">
      <h1>Order Book</h1>
      <p>Live bid/ask depth — lands in Phase 3.</p>
    </section>
  `,
  styles: `
    .feature {
      padding: 1.5rem;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class OrderBookComponent {}
