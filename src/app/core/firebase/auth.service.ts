import { computed, Injectable, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import {
  Auth,
  authState,
  getRedirectResult,
  GoogleAuthProvider,
  linkWithRedirect,
  signInAnonymously,
  signInWithRedirect,
  signOut,
  type User,
} from '@angular/fire/auth';
import { filter, firstValueFrom, take } from 'rxjs';

export interface GoogleRedirectResult {
  user: User;
  returnUrl: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private static readonly SESSION_KEY = 'tradedesk.app-session';
  private static readonly RETURN_URL_KEY = 'tradedesk.auth-return-url';

  private readonly auth = inject(Auth);

  readonly user = toSignal(authState(this.auth), { initialValue: null as User | null });
  readonly isAnonymous = computed(() => this.user()?.isAnonymous ?? true);
  readonly displayLabel = computed(() => {
    const user = this.user();
    if (!user) {
      return 'Signed out';
    }
    if (user.isAnonymous) {
      return 'Guest session';
    }
    return user.displayName ?? user.email ?? 'Signed in';
  });

  /** Resolves once Firebase emits the initial auth state (user or null). */
  waitForAuthResolution(): Promise<User | null> {
    return firstValueFrom(authState(this.auth).pipe(take(1)));
  }

  /** True after the user explicitly signed in on the login page this browser tab session. */
  hasActiveAppSession(): boolean {
    return sessionStorage.getItem(AuthService.SESSION_KEY) === '1';
  }

  markAppSessionActive(): void {
    sessionStorage.setItem(AuthService.SESSION_KEY, '1');
  }

  clearAppSession(): void {
    sessionStorage.removeItem(AuthService.SESSION_KEY);
  }

  async signOut(): Promise<void> {
    this.clearAppSession();
    await signOut(this.auth);
  }

  async signInAsGuest(): Promise<User> {
    if (this.auth.currentUser) {
      return this.auth.currentUser;
    }

    const credential = await signInAnonymously(this.auth);
    return credential.user;
  }

  /** Full-page redirect — avoids popup blockers on deployed hosting. */
  async startGoogleSignInRedirect(returnUrl = '/market-watch'): Promise<void> {
    sessionStorage.setItem(AuthService.RETURN_URL_KEY, returnUrl);
    const provider = new GoogleAuthProvider();
    const current = this.auth.currentUser;

    if (current?.isAnonymous) {
      await linkWithRedirect(current, provider);
      return;
    }

    await signInWithRedirect(this.auth, provider);
  }

  /** Call once on app boot to finish a Google redirect sign-in. */
  async handleGoogleRedirectResult(): Promise<GoogleRedirectResult | null> {
    const result = await getRedirectResult(this.auth);
    if (!result?.user) {
      return null;
    }

    const returnUrl = sessionStorage.getItem(AuthService.RETURN_URL_KEY) ?? '/market-watch';
    sessionStorage.removeItem(AuthService.RETURN_URL_KEY);

    return { user: result.user, returnUrl };
  }

  waitForUser(): Promise<User> {
    return firstValueFrom(
      authState(this.auth).pipe(
        filter((user): user is User => user != null),
        take(1),
      ),
    );
  }
}
