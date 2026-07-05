import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { IamStore } from '../../../application/iam.store';
import { MatButton } from '@angular/material/button';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-authentication-section',
  imports: [MatButton, TranslatePipe],
  templateUrl: './authentication-section.html',
  styleUrl: './authentication-section.css',
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
