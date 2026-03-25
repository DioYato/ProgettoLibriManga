import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { AuthService } from './data/auth.service';

export const authGuard: CanActivateFn = () => {
  const auth = inject(AuthService);
  const router = inject(Router);

 const user = JSON.parse(localStorage.getItem('user') || 'null');

  if (user) {
    return true;
  }

  router.navigate(['/login']);
  return false;
};

