import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon'

@Component({
  selector: 'app-battle-header',
  imports: [CommonModule, RouterModule, MatIconModule],
  standalone: true,
  templateUrl: './battle-header.component.html',
  styleUrl: './battle-header.component.scss'
})
export class BattleHeaderComponent {

}
