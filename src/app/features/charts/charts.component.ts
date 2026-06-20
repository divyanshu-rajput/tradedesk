import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-charts',
  standalone: true,
  template: `
    <section class="feature">
      <h1>Charts</h1>
      <p>Price history line chart — lands in Phase 4.</p>
    </section>
  `,
  styles: `
    .feature {
      padding: 1.5rem;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class ChartsComponent {}
