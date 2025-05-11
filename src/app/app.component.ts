import { Component } from '@angular/core';
import { RouterOutlet, RouterModule } from '@angular/router';
import { FooterComponent } from './components/footer/footer.component';
import { SeparatorComponent } from './components/separator/separator.component';
import { SpecialButtonsComponent } from './components/special-buttons/special-buttons.component';
import { HomeComponent } from './pages/home/home.component';
import { HomeHeaderComponent } from './pages/home-header/home-header.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterModule, FooterComponent, SeparatorComponent, SpecialButtonsComponent, HomeComponent, HomeHeaderComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
}
