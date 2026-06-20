import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-portfolio',
  standalone: true,
  template: `
    <section class="feature">
      <h1>Portfolio</h1>
      <p>Holdings + D3 pie chart — lands in Phase 4.</p>
    </section>
  `,
  styles: `
    .feature {
      padding: 1.5rem;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class PortfolioComponent {}
