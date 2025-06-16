import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Location } from '@angular/common';

@Component({
  selector: 'app-copyright',
  imports: [MatIconModule, RouterModule, CommonModule],
  standalone: true,
  templateUrl: './copyright.component.html',
  styleUrl: './copyright.component.scss'
})
export class CopyrightComponent {

  constructor(private location: Location) { }

  goBack() {
    this.location.back();
  }

}
