import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from './auth.service';

export const adminGuard: CanActivateFn = () => {
  const auth = inject(AuthService);
  const router = inject(Router);
  const rol = (auth.getRol() ?? '').toUpperCase();
  return rol.includes('ADMIN') ? true : router.createUrlTree(['/home']);
};
