import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Raids } from '../../../../backend/models/raids';
import { RaidsComponent } from '../../components/raids/raids.component';

@Component({
  selector: 'app-raids-listing',
  imports: [CommonModule, RaidsComponent],
  standalone: true,
  templateUrl: './raids-listing.component.html',
  styleUrl: './raids-listing.component.scss'
})
export class RaidsListingComponent {
  public RaidsList: Raids[] = [
    { id: 1, name: 'Raid 1', description: 'Description 1', time: 10, reward: 100, missionId: 1, totalPlayers: 1, lider: 'Lider 1' },
    { id: 2, name: 'Raid 2', description: 'Description 2', time: 20, reward: 200, missionId: 2, totalPlayers: 2, lider: 'Lider 2' },
    { id: 3, name: 'Raid 3', description: 'Description 3', time: 30, reward: 300, missionId: 3, totalPlayers: 3, lider: 'Lider 3' },
    { id: 4, name: 'Raid 4', description: 'Description 4', time: 40, reward: 400, missionId: 4, totalPlayers: 4, lider: 'Lider 4' },
    { id: 5, name: 'Raid 5', description: 'Description 5', time: 50, reward: 500, missionId: 5, totalPlayers: 5, lider: 'Lider 5' },
    { id: 6, name: 'Raid 6', description: 'Description 6', time: 60, reward: 600, missionId: 6, totalPlayers: 6, lider: 'Lider 6' },
    { id: 7, name: 'Raid 7', description: 'Description 7', time: 70, reward: 700, missionId: 7, totalPlayers: 7, lider: 'Lider 7' },
    { id: 8, name: 'Raid 8', description: 'Description 8', time: 80, reward: 800, missionId: 8, totalPlayers: 8, lider: 'Lider8' },
    { id: 9, name: 'Raid9', description: 'Description9', time: 90, reward: 900, missionId: 9, totalPlayers: 9, lider: 'Lider9' },
    { id: 10, name: 'Raid10', description: 'Description10', time: 100, reward: 1000, missionId: 10, totalPlayers: 10, lider: 'Lider10' }
  ];

}
