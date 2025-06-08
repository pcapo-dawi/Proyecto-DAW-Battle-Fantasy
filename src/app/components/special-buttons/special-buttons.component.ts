import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-special-buttons',
  imports: [RouterModule, CommonModule],
  standalone: true,
  templateUrl: './special-buttons.component.html',
  styleUrl: './special-buttons.component.scss'
})
export class SpecialButtonsComponent {

}
