import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Missions } from '../../backend/models/missions';
import { MissionsComponent } from '../../components/missions/missions.component';

@Component({
  selector: 'app-missions-listing',
  imports: [CommonModule, MissionsComponent],
  standalone: true,
  templateUrl: './missions-listing.component.html',
  styleUrl: './missions-listing.component.scss'
})
export class MissionsListingComponent {
  public MissionsList: Missions[] = [
    { id: 1, name: 'Mission 1', description: 'Description 1 Matar al super limo porque en este juego solo hay jefes', time: 10, reward: 100 },
    { id: 2, name: 'Mission 2', description: 'Description 2 jndsehjfikbhfdrsb fshdjbhifsdebfsdeb fsdeihbfeuibfsuierydrf uihbuifsdebyuibferyhbfsdr bnuihbefyuibsefuibrfsy iubuiehbyubrffsyhrbonjuifsdnguijnujirndg rgfiouhngrdubgribrdef iuhnfrudbnguirdbgyfbhderg nvguirfhnguiderfnguirgnbirdg ihnfruigbndruigbrb iurfhduighrdeuigbuirg urghuierdghdrfubgudryefbgyuriefdbn grdfuhnguirfdegbyuirdehbgryuhbrgyuibgr oihnuihnuibyuhb', time: 20, reward: 200 },
    { id: 3, name: 'Mission 3', description: 'Description 3 Derrotar al bégimo', time: 30, reward: 300 },
    { id: 4, name: 'Mission 4', description: 'Description 4', time: 40, reward: 400 },
    { id: 5, name: 'Mission 5', description: 'Description 5', time: 50, reward: 500 },
    { id: 6, name: 'Mission 6', description: 'Description 6', time: 60, reward: 600 },
    { id: 7, name: 'Mission 7', description: 'Description 7', time: 70, reward: 700 },
    { id: 8, name: 'Mission 8', description: 'Description 8', time: 80, reward: 800 },
    { id: 9, name: 'Mission 9', description: 'Description 9', time: 90, reward: 900 },
    { id: 10, name: 'Mission 10', description: 'Description 10', time: 100, reward: 1000 },
  ]

}
