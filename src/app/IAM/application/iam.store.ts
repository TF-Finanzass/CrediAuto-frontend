import { computed, Injectable, signal } from '@angular/core';
import { SignInCommand } from '../domain/model/sign-in.command';
import { Router } from '@angular/router';
import { IamApi } from '../infrastructure/iam-api';
import { SignUpCommand } from '../domain/model/sign-up.command';
import { Role } from '../domain/model/role';

interface StoredSession {
  token: string;
  username: string;
  id: number;
  role: Role;
}

const SESSION_KEY = 'session';

@Injectable({ providedIn: 'root' })
export class IamStore {
  private readonly isSignedInSignal = signal<boolean>(false);
  private readonly currentFullNameSignal = signal<string | null>(null);
  private readonly currentUserIdSignal = signal<number | null>(null);
  private readonly currentRoleSignal = signal<Role | null>(null);
  readonly isSignedIn = this.isSignedInSignal.asReadonly();
  readonly currentFullName = this.currentFullNameSignal.asReadonly();
  readonly currentUserId = this.currentUserIdSignal.asReadonly();
  readonly currentRole = this.currentRoleSignal.asReadonly();
  readonly isSeller = computed(() => this.currentRoleSignal() === Role.Seller);
  readonly isBuyer = computed(() => this.currentRoleSignal() === Role.Buyer);

  readonly currentToken = computed(() =>
    this.isSignedIn() ? (this.readSession()?.token ?? null) : null,
  );

  constructor(private iamApi: IamApi) {
    this.rehydrateFromStorage();
  }

  private rehydrateFromStorage(): void {
    const session = this.readSession();
    if (session) {
      this.isSignedInSignal.set(true);
      this.currentFullNameSignal.set(session.username);
      this.currentUserIdSignal.set(session.id);
      this.currentRoleSignal.set(session.role);
    } else {
      this.isSignedInSignal.set(false);
      this.currentFullNameSignal.set(null);
      this.currentUserIdSignal.set(null);
      this.currentRoleSignal.set(null);
    }
  }

  private readSession(): StoredSession | null {
    const raw = localStorage.getItem(SESSION_KEY);
    if (!raw) return null;
    try {
      return JSON.parse(raw) as StoredSession;
    } catch {
      return null;
    }
  }

  private writeSession(session: StoredSession): void {
    localStorage.setItem(SESSION_KEY, JSON.stringify(session));
    localStorage.setItem('token', session.token); // se mantiene por compatibilidad con el interceptor existente
  }

  private clearSession(): void {
    localStorage.removeItem(SESSION_KEY);
    localStorage.removeItem('token');
  }

  signIn(signInCommand: SignInCommand, router: Router, onError?: (message: string) => void) {
    this.iamApi.signIn(signInCommand).subscribe({
      next: (signInResource) => {
        const session: StoredSession = {
          token: signInResource.token,
          username: signInResource.username,
          id: signInResource.id,
          role: signInResource.role as Role,
        };
        this.writeSession(session);
        this.isSignedInSignal.set(true);
        this.currentFullNameSignal.set(session.username);
        this.currentUserIdSignal.set(session.id);
        this.currentRoleSignal.set(session.role);
        router.navigate(['/dashboard']).then();
      },
      error: (err) => {
        const message =
          err?.status === 401 || err?.status === 400
            ? 'Usuario o contraseña incorrectos'
            : 'No se pudo iniciar sesión. Intenta nuevamente.';
        onError?.(message);
      },
    });
  }

  signUp(
    signUpCommand: SignUpCommand,
    router: Router,
    onSuccess?: () => void,
    onError?: (message: string) => void,
  ) {
    this.iamApi.signUp(signUpCommand).subscribe({
      next: () => {
        onSuccess?.();
        router.navigate(['/sign-in']).then();
      },
      error: () => {
        onError?.('No se pudo crear la cuenta. Intenta nuevamente.');
      },
    });
  }

  signOut(router: Router) {
    this.clearSession();
    this.isSignedInSignal.set(false);
    this.currentFullNameSignal.set(null);
    this.currentUserIdSignal.set(null);
    this.currentRoleSignal.set(null);
    router.navigate(['/sign-in']).then();
  }
}
