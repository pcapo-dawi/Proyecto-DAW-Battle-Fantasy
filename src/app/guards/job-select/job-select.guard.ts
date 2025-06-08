import { CanActivateFn } from '@angular/router';

export const jobSelectGuard: CanActivateFn = (route, state) => {
  return true;
};
