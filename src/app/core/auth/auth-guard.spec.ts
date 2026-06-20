import { TestBed } from '@angular/core/testing';
import { Router, UrlTree } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';

jest.mock('../firebase/auth.service', () => ({
  AuthService: class MockAuthService {},
}));

import { AuthService } from '../firebase/auth.service';
import { authGuard, redirectIfAuthenticatedGuard } from './auth-guard';

describe('authGuard', () => {
  let authService: {
    waitForAuthResolution: jest.Mock;
    hasActiveAppSession: jest.Mock;
  };
  let router: Router;

  beforeEach(() => {
    authService = {
      waitForAuthResolution: jest.fn(),
      hasActiveAppSession: jest.fn(),
    };

    TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      providers: [{ provide: AuthService, useValue: authService }],
    });

    router = TestBed.inject(Router);
  });

  it('allows access when the user completed login this session', async () => {
    authService.waitForAuthResolution.mockResolvedValue({ uid: 'abc' });
    authService.hasActiveAppSession.mockReturnValue(true);

    const result = await TestBed.runInInjectionContext(() =>
      authGuard({} as never, { url: '/market-watch' } as never),
    );

    expect(result).toBe(true);
  });

  it('redirects to login when Firebase has a user but the login page was skipped', async () => {
    authService.waitForAuthResolution.mockResolvedValue({ uid: 'abc' });
    authService.hasActiveAppSession.mockReturnValue(false);

    const result = await TestBed.runInInjectionContext(() =>
      authGuard({} as never, { url: '/portfolio' } as never),
    );

    expect(result).toBeInstanceOf(UrlTree);
    expect(router.serializeUrl(result as UrlTree)).toBe('/login?returnUrl=%2Fportfolio');
  });

  it('redirects to login when no session exists', async () => {
    authService.waitForAuthResolution.mockResolvedValue(null);
    authService.hasActiveAppSession.mockReturnValue(false);

    const result = await TestBed.runInInjectionContext(() =>
      authGuard({} as never, { url: '/market-watch' } as never),
    );

    expect(result).toBeInstanceOf(UrlTree);
    expect(router.serializeUrl(result as UrlTree)).toBe('/login?returnUrl=%2Fmarket-watch');
  });
});

describe('redirectIfAuthenticatedGuard', () => {
  let authService: {
    waitForAuthResolution: jest.Mock;
    hasActiveAppSession: jest.Mock;
  };
  let router: Router;

  beforeEach(() => {
    authService = {
      waitForAuthResolution: jest.fn(),
      hasActiveAppSession: jest.fn(),
    };

    TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      providers: [{ provide: AuthService, useValue: authService }],
    });

    router = TestBed.inject(Router);
  });

  it('redirects users who already completed login away from the login page', async () => {
    authService.waitForAuthResolution.mockResolvedValue({ uid: 'abc' });
    authService.hasActiveAppSession.mockReturnValue(true);

    const result = await TestBed.runInInjectionContext(() =>
      redirectIfAuthenticatedGuard({} as never, {} as never),
    );

    expect(result).toBeInstanceOf(UrlTree);
    expect(router.serializeUrl(result as UrlTree)).toBe('/market-watch');
  });

  it('allows the login page when Firebase restored a user but login was not completed', async () => {
    authService.waitForAuthResolution.mockResolvedValue({ uid: 'abc' });
    authService.hasActiveAppSession.mockReturnValue(false);

    const result = await TestBed.runInInjectionContext(() =>
      redirectIfAuthenticatedGuard({} as never, {} as never),
    );

    expect(result).toBe(true);
  });

  it('allows the login page when signed out', async () => {
    authService.waitForAuthResolution.mockResolvedValue(null);
    authService.hasActiveAppSession.mockReturnValue(false);

    const result = await TestBed.runInInjectionContext(() =>
      redirectIfAuthenticatedGuard({} as never, {} as never),
    );

    expect(result).toBe(true);
  });
});
