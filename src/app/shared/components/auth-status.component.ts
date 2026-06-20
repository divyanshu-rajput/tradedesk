import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { Router } from '@angular/router';

import { AuthService } from '../../core/firebase/auth.service';

@Component({
  selector: 'app-auth-status',
  templateUrl: './auth-status.component.html',
  styleUrl: './auth-status.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AuthStatusComponent {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  readonly label = this.authService.displayLabel;
  readonly user = this.authService.user;
  readonly isAnonymous = this.authService.isAnonymous;
  readonly busy = signal(false);
  readonly error = signal<string | null>(null);

  async upgradeWithGoogle(): Promise<void> {
    this.busy.set(true);
    this.error.set(null);

    try {
      await this.authService.startGoogleSignInRedirect(this.router.url);
    } catch (caught) {
      this.busy.set(false);
      this.error.set(caught instanceof Error ? caught.message : 'Google sign-in failed');
    }
  }

  async logOut(): Promise<void> {
    await this.runAuthAction(async () => {
      await this.authService.signOut();
      await this.router.navigate(['/login']);
    });
  }

  private async runAuthAction(action: () => Promise<unknown>): Promise<void> {
    this.busy.set(true);
    this.error.set(null);

    try {
      await action();
    } catch (caught) {
      this.error.set(caught instanceof Error ? caught.message : 'Authentication failed');
    } finally {
      this.busy.set(false);
    }
  }
}
