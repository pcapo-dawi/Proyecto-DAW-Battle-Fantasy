import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';
import { HomeComponent } from './pages/home/home.component';
import { HomeHeaderComponent } from './components/home-header/home-header.component';
import { ProfileComponent } from './pages/profile/profile.component';
import { MissionsListingComponent } from './pages/missions-listing/missions-listing.component';
import { MissionsHeaderComponent } from './components/missions-header/missions-header.component';
import { RaidsListingComponent } from './pages/raids-listing/raids-listing.component';
import { RaidsHeaderComponent } from './components/raids-header/raids-header.component';
import { BattleComponent } from './pages/battle/battle.component';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
    {
        path: 'login',
        component: LoginComponent,
        title: 'Login',
    },
    {
        path: 'register',
        component: RegisterComponent,
        title: 'Register',
    },
    {
        path: '',
        component: HomeComponent,
        title: 'Home',
        canActivate: [authGuard]
    },
    {
        path: '',
        component: HomeHeaderComponent,
        outlet: 'header',
        canActivate: [authGuard]
    },
    {
        path: 'profile',
        component: ProfileComponent,
        title: 'Profile',
        canActivate: [authGuard]
    },
    {
        path: 'missions',
        component: MissionsListingComponent,
        title: 'Missions',
        canActivate: [authGuard]
    },
    {
        path: 'missions',
        component: MissionsHeaderComponent,
        outlet: 'header',
        canActivate: [authGuard]
    },
    {
        path: 'raids',
        component: RaidsListingComponent,
        title: 'Raids',
        canActivate: [authGuard]
    },
    {
        path: 'raids',
        component: RaidsHeaderComponent,
        outlet: 'header',
        canActivate: [authGuard]
    },
    {
        path: 'battle/:id',
        component: BattleComponent,
        title: 'Battle',
        canActivate: [authGuard]
    },
    {
        path: '**',
        redirectTo: '',
        pathMatch: 'full',
    }
];
