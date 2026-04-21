import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';

export const adminGuard: CanActivateFn = () => {
  const router = inject(Router);

  if (typeof window === 'undefined') {
    return router.parseUrl('/login');
  }

  const stored = localStorage.getItem('user');
  if (!stored) {
    return router.parseUrl('/login');
  }

  const user = JSON.parse(stored);

  if (user?.ruolo === 'ADMIN') {
    return true;
  }

  return router.parseUrl('/');
};
