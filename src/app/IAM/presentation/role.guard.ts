import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { IamStore } from '../application/iam.store';

export const buyerOnlyGuard: CanActivateFn = () => {
  const store = inject(IamStore);
  const router = inject(Router);

  if (store.isBuyer()) return true;

  router.navigate(['/unauthorized']).then();
  return false;
};
