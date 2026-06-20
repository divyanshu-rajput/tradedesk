import { EnvironmentProviders, inject, provideAppInitializer } from '@angular/core';
import { Router } from '@angular/router';
import { FirebaseApp, initializeApp, provideFirebaseApp } from '@angular/fire/app';
import {
  Auth,
  browserSessionPersistence,
  connectAuthEmulator,
  getAuth,
  provideAuth,
  setPersistence,
} from '@angular/fire/auth';
import {
  connectFirestoreEmulator,
  Firestore,
  initializeFirestore,
  memoryLocalCache,
  persistentLocalCache,
  provideFirestore,
} from '@angular/fire/firestore';

import { environment } from '../../../environments/environment';
import { AuthService } from './auth.service';

function createAuth(): Auth {
  const auth = getAuth();
  if (environment.useEmulators) {
    connectAuthEmulator(auth, 'http://127.0.0.1:9099', { disableWarnings: true });
  }
  return auth;
}

function createFirestore(app: FirebaseApp): Firestore {
  const firestore = initializeFirestore(app, {
    localCache: environment.useEmulators ? memoryLocalCache() : persistentLocalCache(),
  });
  if (environment.useEmulators) {
    connectFirestoreEmulator(firestore, '127.0.0.1', 8080);
  }
  return firestore;
}

export function provideFirebaseProviders(): EnvironmentProviders[] {
  return [
    provideFirebaseApp(() => initializeApp(environment.firebase)),
    provideAuth(() => createAuth()),
    provideFirestore((injector) => createFirestore(injector.get(FirebaseApp))),
    provideAppInitializer(async () => {
      const auth = inject(Auth);

      if (environment.useEmulators) {
        await setPersistence(auth, browserSessionPersistence);
      }

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
