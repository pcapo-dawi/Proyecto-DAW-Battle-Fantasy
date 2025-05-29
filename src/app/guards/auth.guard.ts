import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';

export const authGuard: CanActivateFn = (route, state) => {
  const cookieService = inject(CookieService);
  const router = inject(Router);
  const token = cookieService.get('token');
  const url = state.url;

  // Permitir acceso libre a login y register
  if (url === '/login' || url === '/register') {
    return true;
  }

  if (token) {
    return true;
  } else {
    router.navigate(['/login']);
    return false;
  }
};
