import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-order-placement',
  standalone: true,
  template: `
    <section class="feature">
      <h1>Order Placement</h1>
      <p>Reactive order form — lands in Phase 3.</p>
    </section>
  `,
  styles: `
    .feature {
      padding: 1.5rem;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class OrderPlacementComponent {}
