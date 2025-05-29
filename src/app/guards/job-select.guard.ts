import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { PlayersService } from '../players/players.service';
import { firstValueFrom } from 'rxjs';

export const jobSelectGuard: CanActivateFn = async (route, state) => {
    const router = inject(Router);
    const playersService = inject(PlayersService);

    try {
        const data = await firstValueFrom(playersService.getPlayerLogged());
        // Si el usuario YA tiene Job y Aspect, redirige a home
        if (data.player.ID_Job && data.player.ID_JobAspect) {
            router.navigate(['/home']);
            return false;
        }
        // Si NO tiene Job o Aspect, permite el acceso
        return true;
    } catch (e) {
        // Si hay error (no autenticado), redirige a login
        router.navigate(['/login']);
        return false;
    }
};