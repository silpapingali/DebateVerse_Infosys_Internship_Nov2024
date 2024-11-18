import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthServiceService } from '../services/auth-service/auth-service.service';

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const authService = inject(AuthServiceService);

  if (authService.isLoggedIn()) {
    if (authService.getUser().role === 'ADMIN') {
      router.navigate(['/admin']);
    } else if (authService.getUser().role === 'USER') {
      router.navigate(['/user']);
    }
    return false;
  }
  return true;
};
