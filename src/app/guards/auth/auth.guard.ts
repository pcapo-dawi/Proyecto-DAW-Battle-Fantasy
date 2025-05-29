import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';

export const authGuard: CanActivateFn = (route, state) => {
  const cookieService = inject(CookieService);
  const router = inject(Router);
  const token = cookieService.get('token');
  const url = state.url;

  // Si el usuario ya está autenticado, no permitir acceso a login ni register
  if ((url === '/login' || url === '/register') && token) {
    router.navigate(['/home']);
    return false;
  }

  // Permitir acceso libre a login y register si NO hay token
  if ((url === '/login' || url === '/register') && !token) {
    return true;
  }

  // Para el resto de rutas, exigir token
  if (token) {
    return true;
  } else {
    router.navigate(['/login']);
    return false;
  }
};
