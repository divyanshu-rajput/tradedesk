import { computed, Injectable, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import {
  Auth,
  authState,
  browserSessionPersistence,
  getRedirectResult,
  GoogleAuthProvider,
  setPersistence,
  signInAnonymously,
  signInWithRedirect,
  signOut,
  type User,
} from '@angular/fire/auth';
import { filter, firstValueFrom, take } from 'rxjs';

import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private static readonly SESSION_KEY = 'tradedesk.app-session';
  private static readonly RETURN_URL_KEY = 'tradedesk.auth-return-url';
  private static readonly PENDING_GOOGLE_KEY = 'tradedesk.auth-google-pending';

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

    if (environment.useEmulators) {
      await setPersistence(this.auth, browserSessionPersistence);
    }

    const credential = await signInAnonymously(this.auth);
    return credential.user;
  }

  /**
   * Starts Google sign-in via full-page redirect (avoids popup blockers on deployed sites).
   * The page navigates away; completion is handled by {@link completeRedirectSignIn} on return.
   */
  async signInWithGoogle(returnUrl = '/market-watch'): Promise<void> {
    sessionStorage.setItem(AuthService.RETURN_URL_KEY, returnUrl);
    sessionStorage.setItem(AuthService.PENDING_GOOGLE_KEY, '1');

    const provider = new GoogleAuthProvider();
    const current = this.auth.currentUser;

    // Always use redirect (never popup/link). Sign out anonymous first so Google gets a clean redirect.
    if (current?.isAnonymous) {
      await signOut(this.auth);
    }

    await signInWithRedirect(this.auth, provider);
  }

  /** Call on app boot to finish a Google redirect sign-in, if one is in progress. */
  async completeRedirectSignIn(): Promise<User | null> {
    try {
      const result = await getRedirectResult(this.auth);
      if (!result?.user) {
        sessionStorage.removeItem(AuthService.PENDING_GOOGLE_KEY);
        return null;
      }

      if (sessionStorage.getItem(AuthService.PENDING_GOOGLE_KEY) === '1') {
        this.markAppSessionActive();
        sessionStorage.removeItem(AuthService.PENDING_GOOGLE_KEY);
      }

      return result.user;
    } catch (error) {
      sessionStorage.removeItem(AuthService.PENDING_GOOGLE_KEY);
      throw error;
    }
  }

  consumeAuthReturnUrl(): string {
    const returnUrl = sessionStorage.getItem(AuthService.RETURN_URL_KEY) ?? '/market-watch';
    sessionStorage.removeItem(AuthService.RETURN_URL_KEY);
    return returnUrl;
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
