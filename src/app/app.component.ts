import { Component } from '@angular/core';
import { RouterOutlet, RouterModule } from '@angular/router';
import { FooterComponent } from './components/footer/footer.component';
import { SeparatorComponent } from './components/separator/separator.component';
import { SpecialButtonsComponent } from './components/special-buttons/special-buttons.component';
import { HomeComponent } from './pages/home/home.component';
import { HomeHeaderComponent } from './pages/home-header/home-header.component';
import { MissionsListingComponent } from './pages/missions-listing/missions-listing.component';
import { RaidsListingComponent } from './pages/raids-listing/raids-listing.component';
import { ProfileComponent } from './pages/profile/profile.component';
import { BattleComponent } from './pages/battle/battle.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterModule, FooterComponent, SeparatorComponent, SpecialButtonsComponent, HomeComponent, HomeHeaderComponent,
    MissionsListingComponent, RaidsListingComponent, ProfileComponent, BattleComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
}
