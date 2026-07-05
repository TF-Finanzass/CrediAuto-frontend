import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { MatIconModule } from '@angular/material/icon';
import { IamStore } from '../../../../IAM/application/iam.store';

@Component({
  selector: 'app-unauthorized',
  imports: [TranslatePipe, MatIconModule],
  templateUrl: './unauthorized.html',
  styleUrl: './unauthorized.css',
})
export class Unauthorized {
  private router = inject(Router);
  private store = inject(IamStore);

  signOut(): void {
    this.store.signOut(this.router);
  }
}
