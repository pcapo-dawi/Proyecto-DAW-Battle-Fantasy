import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Location } from '@angular/common';

@Component({
  selector: 'app-how-to-play',
  imports: [MatIconModule, RouterModule, CommonModule],
  standalone: true,
  templateUrl: './how-to-play.component.html',
  styleUrl: './how-to-play.component.scss'
})
export class HowToPlayComponent {

  constructor(private location: Location) { }

  goBack() {
    this.location.back();
  }
}
