import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-copyright-header',
  imports: [CommonModule, RouterModule],
  standalone: true,
  templateUrl: './copyright-header.component.html',
  styleUrl: './copyright-header.component.scss'
})
export class CopyrightHeaderComponent {

}
