import { Component } from '@angular/core';
import { RouterOutlet, RouterModule } from '@angular/router';
import { SeparatorComponent } from './components/separator/separator.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterModule, SeparatorComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
}
