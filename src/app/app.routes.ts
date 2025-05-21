import { Routes } from '@angular/router';
import { BattleComponent } from './pages/battle/battle.component';
import { HomeComponent } from './pages/home/home.component';
import { HomeHeaderComponent } from './components/home-header/home-header.component';
import { ProfileComponent } from './pages/profile/profile.component';
import { MissionsListingComponent } from './pages/missions-listing/missions-listing.component';
import { MissionsHeaderComponent } from './components/missions-header/missions-header.component';
import { RaidsListingComponent } from './pages/raids-listing/raids-listing.component';
import { RaidsHeaderComponent } from './components/raids-header/raids-header.component';

export const routes: Routes = [
    {
        //path: 'battle/:id',
        //component: BattleComponent

        path: '',
        component: HomeComponent,
        title: 'Home',
    },
    {
        path: '',
        component: HomeHeaderComponent,
        outlet: 'header'
    },
    {
        path: 'profile',
        component: ProfileComponent,
        title: 'Profile',
    },
    {
        path: 'missions',
        component: MissionsListingComponent,
        title: 'Missions',
    },
    {
        path: 'missions',
        component: MissionsHeaderComponent,
        outlet: 'header'
    },
    {
        path: 'raids',
        component: RaidsListingComponent,
        title: 'Raids',
    },
    {
        path: 'raids',
        component: RaidsHeaderComponent,
        outlet: 'header'
    },
    {
        path: 'battle/:id',
        component: BattleComponent,
        title: 'Battle',
    }
];
