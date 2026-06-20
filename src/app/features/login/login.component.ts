import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { AuthService } from '../../core/firebase/auth.service';

@Component({
  selector: 'app-login',
  imports: [],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class LoginComponent {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  readonly signingIn = signal(false);
  readonly error = signal<string | null>(null);

  async continueAsGuest(): Promise<void> {
    await this.authenticate(() => this.authService.signInAsGuest());
  }

  async signInWithGoogle(): Promise<void> {
    this.signingIn.set(true);
    this.error.set(null);

    try {
      const returnUrl = this.route.snapshot.queryParamMap.get('returnUrl') ?? '/market-watch';
      await this.authService.startGoogleSignInRedirect(returnUrl);
    } catch (caught) {
      this.signingIn.set(false);
      this.error.set(caught instanceof Error ? caught.message : 'Sign-in failed');
    }
  }

  private async authenticate(action: () => Promise<unknown>): Promise<void> {
    this.signingIn.set(true);
    this.error.set(null);

    try {
      await action();
      this.authService.markAppSessionActive();
      const returnUrl = this.route.snapshot.queryParamMap.get('returnUrl') ?? '/market-watch';
      await this.router.navigateByUrl(returnUrl);
    } catch (caught) {
      this.error.set(caught instanceof Error ? caught.message : 'Sign-in failed');
    } finally {
      this.signingIn.set(false);
    }
  }
}
