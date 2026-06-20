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
  readonly error = signal<string | null>(this.consumeAuthError());

  async continueAsGuest(): Promise<void> {
    await this.authenticate(() => this.authService.signInAsGuest());
  }

  async signInWithGoogle(): Promise<void> {
    this.signingIn.set(true);
    this.error.set(null);

    try {
      const returnUrl = this.route.snapshot.queryParamMap.get('returnUrl') ?? '/market-watch';
      await this.authService.signInWithGoogle(returnUrl);
    } catch (caught) {
      this.signingIn.set(false);
      this.error.set(caught instanceof Error ? caught.message : 'Sign-in failed');
    }
  }

  private consumeAuthError(): string | null {
    const message = sessionStorage.getItem('tradedesk.auth-error');
    if (message) {
      sessionStorage.removeItem('tradedesk.auth-error');
    }
    return message;
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
