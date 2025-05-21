import { Component } from '@angular/core';
import { RouterOutlet, RouterModule } from '@angular/router';
import { FooterComponent } from './components/footer/footer.component';
import { SeparatorComponent } from './components/separator/separator.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterModule, FooterComponent, SeparatorComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
}
