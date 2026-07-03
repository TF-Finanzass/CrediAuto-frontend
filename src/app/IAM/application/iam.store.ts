import {computed, Injectable, signal} from '@angular/core';
import {User} from '../domain/model/user.entity';
import {SignInCommand} from '../domain/model/sign-in.command';
import {Router} from '@angular/router';
import {IamApi} from '../infrastructure/iam-api';
import {SignUpCommand} from '../domain/model/sign-up.command';
import {Role} from '../domain/model/role';

/**
 * Application service store for managing Identity and Access Management state in the IAM bounded context.
 * Handles user authentication, sign-in, sign-up, and user data.
 */
@Injectable({providedIn: 'root'})
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

  readonly currentToken = computed(() => this.isSignedIn() ? localStorage.getItem('token') : null);

  /**
   * Creates an instance of IamStore.
   * @param iamApi The IAM API service.
   */
  constructor(private iamApi: IamApi) {
    this.isSignedInSignal.set(false);
    this.currentFullNameSignal.set(null);
    this.currentUserIdSignal.set(null);
    this.currentRoleSignal.set(null);
  }

  /**
   * Signs in a user with the provided credentials.
   */
  signIn(signInCommand: SignInCommand, router: Router) {
    this.iamApi.signIn(signInCommand).subscribe({
      next: (signInResource) => {
        localStorage.setItem('token', signInResource.token);
        this.isSignedInSignal.set(true);
        this.currentFullNameSignal.set(signInResource.username); // ahora usa username
        this.currentUserIdSignal.set(signInResource.id);
        this.currentRoleSignal.set(signInResource.role as Role);
        router.navigate(['/dashboard']).then();
      },
      // ...
    });
  }

  /**
   * Signs up a new user.
   */
  signUp(signUpCommand: SignUpCommand, router: Router) {
    this.iamApi.signUp(signUpCommand).subscribe({
      next: (signUpResource) => {
        console.log('Sign-up successful:', signUpResource);
        router.navigate(['/sign-in']).then();
      },
      error: (err) => {
        console.error('Sign-up failed:', err);
        router.navigate(['/sign-up']).then();
      }
    });
  }

  /**
   * Signs out the current user.
   */
  signOut(router: Router) {
    localStorage.removeItem('token');
    this.isSignedInSignal.set(false);
    this.currentFullNameSignal.set(null);
    this.currentUserIdSignal.set(null);
    this.currentRoleSignal.set(null);
    router.navigate(['/sign-in']).then();
  }
}
