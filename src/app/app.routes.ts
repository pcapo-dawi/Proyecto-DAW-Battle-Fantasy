import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { LoginHeaderComponent } from './components/login-header/login-header.component';
import { RegisterComponent } from './pages/register/register.component';
import { SelectJobListingComponent } from './pages/select-job-listing/select-job-listing.component';
import { HomeComponent } from './pages/home/home.component';
import { HomeHeaderComponent } from './components/home-header/home-header.component';
import { ProfileComponent } from './pages/profile/profile.component';
import { ProfileHeaderComponent } from './components/profile-header/profile-header.component';
import { MissionsListingComponent } from './pages/missions-listing/missions-listing.component';
import { MissionsHeaderComponent } from './components/missions-header/missions-header.component';
import { RaidsListingComponent } from './pages/raids-listing/raids-listing.component';
import { RaidsHeaderComponent } from './components/raids-header/raids-header.component';
import { BattleComponent } from './pages/battle/battle.component';
import { BattleHeaderComponent } from './components/battle-header/battle-header.component';
import { CopyrightComponent } from './pages/copyright/copyright.component';
import { CopyrightHeaderComponent } from './components/copyright-header/copyright-header.component';
import { HowToPlayComponent } from './pages/how-to-play/how-to-play.component';
import { HowToPlayHeaderComponent } from './components/how-to-play-header/how-to-play-header.component';
import { authGuard } from './guards/auth/auth.guard';
import { jobSelectGuard } from './guards/job-select.guard';

export const routes: Routes = [
    {
        path: 'login',
        component: LoginComponent,
        title: 'Login',
    },
    {
        path: 'login',
        component: LoginHeaderComponent,
        outlet: 'header',
    },
    {
        path: 'register',
        component: RegisterComponent,
        title: 'Register',
    },
    {
        path: 'register',
        component: LoginHeaderComponent,
        outlet: 'header',
    },
    {
        path: 'select-job',
        component: SelectJobListingComponent,
        title: 'Select Job',
        canActivate: [authGuard, jobSelectGuard]
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
        path: 'profile',
        component: ProfileHeaderComponent,
        outlet: 'header',
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
        path: 'battle/:id',
        component: BattleHeaderComponent,
        outlet: 'header',
        canActivate: [authGuard]
    },
    {
        path: 'copyright',
        component: CopyrightComponent,
        title: 'Copyright',
    },
    {
        path: 'copyright',
        component: CopyrightHeaderComponent,
        outlet: 'header',
    },
    {
        path: 'how-to-play',
        component: HowToPlayComponent,
        title: 'How to Play',
    },
    {
        path: 'how-to-play',
        component: HowToPlayHeaderComponent,
        outlet: 'header',
    },
    {
        path: '**',
        redirectTo: '',
        pathMatch: 'full',
    }
];
