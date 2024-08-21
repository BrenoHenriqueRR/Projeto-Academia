import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthserviceService } from '../../services/authService/authservice.service';

export const adminGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthserviceService);
  const router = inject(Router);

  if (authService.isLoggedInAdm()) {
    return true;
  } else {
    router.navigate(['/admin']);
    return false;
  }
};
