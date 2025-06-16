import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { PlayersService } from '../players/players.service';
import { firstValueFrom } from 'rxjs';

export const jobSelectGuard: CanActivateFn = async (route, state) => {
    const router = inject(Router);
    const playersService = inject(PlayersService);

    try {
        const data = await firstValueFrom(playersService.getPlayerLogged());
        //Si el usuario YA tiene Job y Aspect, permite el acceso
        if (data.player.ID_Job && data.player.ID_JobAspect) {
            return true;
        }
        //Si NO tiene Job o Aspect, redirige a select-job
        router.navigate(['/select-job']);
        return false;
    } catch (e: any) {
        //Si el error es 401 (no autenticado), redirige a login
        if (e.status === 401) {
            router.navigate(['/login']);
        } else {
            //Para cualquier otro error, redirige a select-job
            router.navigate(['/select-job']);
        }
        return false;
    }
};