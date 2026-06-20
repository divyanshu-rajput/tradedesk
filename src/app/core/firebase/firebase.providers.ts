import { EnvironmentProviders, inject, provideAppInitializer } from '@angular/core';
import { Router } from '@angular/router';
import { FirebaseApp, initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { connectAuthEmulator, getAuth, provideAuth, Auth } from '@angular/fire/auth';
import {
  connectFirestoreEmulator,
  getFirestore,
  initializeFirestore,
  persistentLocalCache,
  provideFirestore,
} from '@angular/fire/firestore';

import { environment } from '../../../environments/environment';
import { AuthService } from './auth.service';

function connectEmulators(app: FirebaseApp, auth: Auth): void {
  if (!environment.useEmulators) {
    return;
  }

  connectAuthEmulator(auth, 'http://127.0.0.1:9099', { disableWarnings: true });
  connectFirestoreEmulator(getFirestore(app), '127.0.0.1', 8080);
}

export function provideFirebaseProviders(): EnvironmentProviders[] {
  return [
    provideFirebaseApp(() => initializeApp(environment.firebase)),
    provideAuth(() => getAuth()),
    provideFirestore((injector) => {
      const app = injector.get(FirebaseApp);
      return initializeFirestore(app, { localCache: persistentLocalCache() });
    }),
    provideAppInitializer(async () => {
      const app = inject(FirebaseApp);
      const auth = inject(Auth);
      connectEmulators(app, auth);

      const authService = inject(AuthService);
      const router = inject(Router);

      try {
        const user = await authService.completeRedirectSignIn();
        if (user && authService.hasActiveAppSession()) {
          await router.navigateByUrl(authService.consumeAuthReturnUrl());
        }
      } catch {
        sessionStorage.setItem('tradedesk.auth-error', 'Google sign-in failed. Please try again.');
      }
    }),
  ];
}
