import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon'

@Component({
  selector: 'app-home-header',
  imports: [CommonModule, RouterModule, MatIconModule],
  standalone: true,
  templateUrl: './home-header.component.html',
  styleUrl: './home-header.component.scss'
})
export class HomeHeaderComponent {

}
