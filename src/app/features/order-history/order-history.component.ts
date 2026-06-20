import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-order-history',
  standalone: true,
  template: `
    <section class="feature">
      <h1>Order History</h1>
      <p>CDK virtual scroll list — lands in Phase 4.</p>
    </section>
  `,
  styles: `
    .feature {
      padding: 1.5rem;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class OrderHistoryComponent {}
