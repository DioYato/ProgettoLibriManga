import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const authGuard: CanActivateFn = () => {
  const auth = inject(AuthService);
  const router = inject(Router);

  if (typeof window === 'undefined') {
    return router.parseUrl('/login');
  }

  const stored = localStorage.getItem('user');
  if (!stored) {
    return router.parseUrl('/login');
  }

  const user = JSON.parse(stored);
  if (user) {
    return true;
  }

  return router.parseUrl('/login');
};


