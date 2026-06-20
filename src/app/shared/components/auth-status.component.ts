import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';

import { AuthService } from '../../core/firebase/auth.service';

@Component({
  selector: 'app-auth-status',
  templateUrl: './auth-status.component.html',
  styleUrl: './auth-status.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AuthStatusComponent {
  private readonly authService = inject(AuthService);

  readonly label = this.authService.displayLabel;
  readonly isAnonymous = this.authService.isAnonymous;
  readonly signingIn = signal(false);
  readonly error = signal<string | null>(null);

  async upgradeWithGoogle(): Promise<void> {
    this.signingIn.set(true);
    this.error.set(null);

    try {
      await this.authService.signInWithGoogle();
    } catch (caught) {
      this.error.set(caught instanceof Error ? caught.message : 'Google sign-in failed');
    } finally {
      this.signingIn.set(false);
    }
  }
}
