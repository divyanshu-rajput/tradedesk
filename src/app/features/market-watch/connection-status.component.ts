import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { Store } from '@ngrx/store';

import { selectConnectionStatus } from '../../state/market/market.selectors';

@Component({
  selector: 'app-connection-status',
  standalone: true,
  template: `
    <span class="status" [class]="'status--' + status()">
      {{ label() }}
    </span>
  `,
  styles: `
    .status {
      display: inline-flex;
      align-items: center;
      padding: 0.25rem 0.625rem;
      border-radius: 999px;
      font-size: 0.75rem;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.04em;
    }

    .status--open {
      background: rgba(34, 197, 94, 0.15);
      color: #4ade80;
    }

    .status--demo {
      background: rgba(59, 130, 246, 0.15);
      color: #60a5fa;
    }

    .status--connecting,
    .status--reconnecting {
      background: rgba(234, 179, 8, 0.15);
      color: #facc15;
    }

    .status--closed {
      background: rgba(148, 163, 184, 0.15);
      color: #94a3b8;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ConnectionStatusComponent {
  private readonly store = inject(Store);

  readonly status = this.store.selectSignal(selectConnectionStatus);

  readonly label = computed(() => {
    switch (this.status()) {
      case 'open':
        return 'Live';
      case 'demo':
        return 'Demo';
      case 'connecting':
        return 'Connecting';
      case 'reconnecting':
        return 'Reconnecting';
      default:
        return 'Offline';
    }
  });
}
