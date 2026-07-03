import {Component, inject} from '@angular/core';
import {Router} from '@angular/router';
import {IamStore} from '../../../application/iam.store';
import {MatButton} from '@angular/material/button';

/**
 * Component for handling authentication actions in the presentation layer of the IAM bounded context.
 */
@Component({
  selector: 'app-authentication-section',
  imports: [MatButton],
  templateUrl: './authentication-section.html',
  styleUrl: './authentication-section.css'
})
export class AuthenticationSection {
  private router = inject(Router);
  protected store = inject(IamStore);

  performSignIn() {
    this.router.navigate(['/sign-in']).then();
  }

  performSignUp() {
    this.router.navigate(['/sign-up']).then();
  }

  performSignOut() {
    this.store.signOut(this.router);
  }
}
