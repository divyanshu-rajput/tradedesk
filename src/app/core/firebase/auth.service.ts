import { computed, Injectable, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import {
  Auth,
  authState,
  GoogleAuthProvider,
  linkWithPopup,
  signInAnonymously,
  signInWithPopup,
  type User,
} from '@angular/fire/auth';
import { filter, firstValueFrom, take } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly auth = inject(Auth);

  readonly user = toSignal(authState(this.auth), { initialValue: null as User | null });
  readonly isAnonymous = computed(() => this.user()?.isAnonymous ?? true);
  readonly displayLabel = computed(() => {
    const user = this.user();
    if (!user) {
      return 'Signing in…';
    }
    if (user.isAnonymous) {
      return 'Guest session';
    }
    return user.displayName ?? user.email ?? 'Signed in';
  });

  constructor() {
    void this.ensureSignedIn();
  }

  async ensureSignedIn(): Promise<User> {
    if (this.auth.currentUser) {
      return this.auth.currentUser;
    }

    const credential = await signInAnonymously(this.auth);
    return credential.user;
  }

  async signInWithGoogle(): Promise<User> {
    const provider = new GoogleAuthProvider();
    const current = this.auth.currentUser;

    if (current?.isAnonymous) {
      try {
        const linked = await linkWithPopup(current, provider);
        return linked.user;
      } catch {
        const signedIn = await signInWithPopup(this.auth, provider);
        return signedIn.user;
      }
    }

    const signedIn = await signInWithPopup(this.auth, provider);
    return signedIn.user;
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
