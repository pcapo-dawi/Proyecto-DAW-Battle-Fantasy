import { Component } from '@angular/core';
import { RouterOutlet, RouterModule } from '@angular/router';
import { SeparatorComponent } from './components/separator/separator.component';
import { SpecialButtonsComponent } from './components/special-buttons/special-buttons.component';
import { FooterComponent } from './components/footer/footer.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterModule, SeparatorComponent, SpecialButtonsComponent, FooterComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
}
