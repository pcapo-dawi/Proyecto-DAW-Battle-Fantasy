import { Component, ElementRef, Input, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Players } from '../../backend/models/players';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-battle',
  imports: [CommonModule, MatCardModule],
  standalone: true,
  templateUrl: './battle.component.html',
  styleUrl: './battle.component.scss'
})
export class BattleComponent {
  @Input() Players: Players =
    { id: 2, name: 'Player 2', hp: 200, attack: 20, defense: 20, experience: 200, level: 2, honors: 20, money: 20, job: 'Mage', skill1Name: 'Fireball', skill1Description: 'Launches a fireball', skill1Cooldown: 5, skill1LvlUnlock: 1, skill2Name: 'Ice Spike', skill2Description: 'Launches an ice spike', skill2Cooldown: 6, skill2LvlUnlock: 2, skill3Name: 'Lightning Bolt', skill3Description: 'Launches a lightning bolt', skill3Cooldown: 7, skill3LvlUnlock: 3, uniqueAbilityName: 'Rexcalibur', uniqueAbilityDescription: 'Powerfull wind attack', uniqueAbilityCooldown: 10, lider: false }
  //   { id: 3, name: 'Player 3', hp: 300, attack: 30, defense: 30, experience: 300, level: 3, honors: 30, money: 300, job: 'Archer', skill1Name: 'Arrow Rain', skill1Description: 'Launches a rain of arrows', skill1Cooldown: 5, skill1LvlUnlock: 1, skill2Name: 'Eagle Eye', skill2Description: 'Increases accuracy', skill2Cooldown: 6, skill2LvlUnlock: 2, skill3Name: 'Rapid Fire', skill3Description: 'Fires arrows rapidly', skill3Cooldown: 7, skill3LvlUnlock: 3, uniqueAbilityName: 'Camouflage', uniqueAbilityDescription: 'Becomes invisible', uniqueAbilityCooldown: 10, lider: false }
  //   { id: 4, name: 'Player 4', hp: 400, attack: 40, defense: 40, experience: 400, level: 4, honors: 40, money: 400, job: 'Warrior', skill1Name: 'Shield Bash', skill1Description: 'Bashes with a shield', skill1Cooldown: 5, skill1LvlUnlock: 1, skill2Name: 'Sword Slash', skill2Description: 'Slashes with a sword', skill2Cooldown: 6, skill2LvlUnlock: 2, skill3Name: 'Battle Cry', skill3Description: 'Increases attack power', skill3Cooldown: 7, skill3LvlUnlock: 3, uniqueAbilityName: 'Charge', uniqueAbilityDescription: 'Charges at an enemy', uniqueAbilityCooldown: 10, lider: false }

  @ViewChild('normalAttackVideo') normalAttackVideo!: ElementRef<HTMLVideoElement>;

  showIdle = true;
  showEnemyIdle = true;

  attack(): void {
    this.showIdle = false;
    this.showEnemyIdle = false;
    setTimeout(() => {
      if (this.normalAttackVideo && this.normalAttackVideo.nativeElement) {
        const video = this.normalAttackVideo.nativeElement;
        video.currentTime = 0;
        video.play();
      }
    });
  }

  onAttackVideoEnded(video: HTMLVideoElement): void {
    video.hidden = true;
    this.showIdle = true;
    this.showEnemyIdle = true;
  }
}
