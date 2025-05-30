import { Component, inject, ElementRef, Input, ViewChild, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Player } from '../../../../backend/models/player';
import { Mission } from '../../../../backend/models/mission';
import { MatCardModule } from '@angular/material/card';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { PlayersService } from '../../players/players.service'; // Ajusta el path si es necesario

@Component({
  selector: 'app-battle',
  imports: [CommonModule, MatCardModule],
  standalone: true,
  templateUrl: './battle.component.html',
  styleUrl: './battle.component.scss'
})
export class BattleComponent implements OnInit {
  @Input() Players: Player =
    { id: 2, name: 'Player 2', hp: 200, attack: 20, defense: 20, experience: 200, level: 2, honors: 20, money: 20, job: 'Mage', skill1Name: 'Fireball', skill1Description: 'Launches a fireball', skill1Cooldown: 5, skill1LvlUnlock: 1, skill2Name: 'Ice Spike', skill2Description: 'Launches an ice spike', skill2Cooldown: 6, skill2LvlUnlock: 2, skill3Name: 'Lightning Bolt', skill3Description: 'Launches a lightning bolt', skill3Cooldown: 7, skill3LvlUnlock: 3, uniqueAbilityName: 'Rexcalibur', uniqueAbilityDescription: 'Powerfull wind attack', uniqueAbilityCooldown: 10, lider: false }
  //   { id: 3, name: 'Player 3', hp: 300, attack: 30, defense: 30, experience: 300, level: 3, honors: 30, money: 300, job: 'Archer', skill1Name: 'Arrow Rain', skill1Description: 'Launches a rain of arrows', skill1Cooldown: 5, skill1LvlUnlock: 1, skill2Name: 'Eagle Eye', skill2Description: 'Increases accuracy', skill2Cooldown: 6, skill2LvlUnlock: 2, skill3Name: 'Rapid Fire', skill3Description: 'Fires arrows rapidly', skill3Cooldown: 7, skill3LvlUnlock: 3, uniqueAbilityName: 'Camouflage', uniqueAbilityDescription: 'Becomes invisible', uniqueAbilityCooldown: 10, lider: false }
  //   { id: 4, name: 'Player 4', hp: 400, attack: 40, defense: 40, experience: 400, level: 4, honors: 40, money: 400, job: 'Warrior', skill1Name: 'Shield Bash', skill1Description: 'Bashes with a shield', skill1Cooldown: 5, skill1LvlUnlock: 1, skill2Name: 'Sword Slash', skill2Description: 'Slashes with a sword', skill2Cooldown: 6, skill2LvlUnlock: 2, skill3Name: 'Battle Cry', skill3Description: 'Increases attack power', skill3Cooldown: 7, skill3LvlUnlock: 3, uniqueAbilityName: 'Charge', uniqueAbilityDescription: 'Charges at an enemy', uniqueAbilityCooldown: 10, lider: false }

  //@Input() missionId: Mission[] = []
  //route: ActivatedRoute = inject(ActivatedRoute);

  missionId: number | null = null;
  missionData?: Mission;

  private route = inject(ActivatedRoute);
  private http = inject(HttpClient);
  private playersService = inject(PlayersService);
  private router = inject(Router);

  player: any; // Añade esta propiedad

  enemyInitialHP: number = 0;
  enemyCurrentHP: number = 0;

  ngOnInit() {
    this.playersService.getPlayerLogged().subscribe({
      next: (data) => {
        this.player = data.player;
        this.route.params.subscribe(params => {
          this.missionId = params['id'];
          if (this.missionId && this.player) {
            // 1. Carga los datos de la misión y enemigo
            this.http.get<any>(`http://localhost:3000/api/missions/${this.missionId}`).subscribe({
              next: (mission) => {
                this.missionData = mission;
              }
            });

            // 2. Crea la misión activa
            this.http.post<any>('http://localhost:3000/api/active-missions/start', {
              playerId: this.player.ID,
              missionId: this.missionId
            }).subscribe({
              next: (data) => {
                this.enemyInitialHP = data.enemyHP;
                this.enemyCurrentHP = data.enemyHP;
              },
              error: (err) => {
                // Si ya existe, puedes ignorar el error o manejarlo
              }
            });
          }
        });
      }
    });
  }

  constructor() {
    this.route.params.subscribe(params => {
      const missionId = params['id'];
      // Aquí puedes hacer algo con el ID de la misión, como cargar datos específicos
      console.log('Misión ID:', missionId);
    });
  }

  @ViewChild('normalAttackVideo') normalAttackVideo!: ElementRef<HTMLVideoElement>;
  @ViewChild('attackEnemyVideo') attackEnemyVideo!: ElementRef<HTMLVideoElement>;

  canAttack = true;
  canUseSkill1 = true;
  canUseSkill2 = true;
  canUseSkill3 = true;
  canUseUniqueAbility = true;
  showIdle = true;
  showEnemyIdle = true;
  showEnemyAttack = false;
  showPlayerDamaged = false;

  // Cuando ataques y recibas el nuevo HP del backend:
  updateEnemyHP(newHP: number) {
    this.enemyCurrentHP = newHP;
  }

  attack(): void {
    if (!this.canAttack || !this.player || !this.missionData) {
      return;
    }
    this.canAttack = false;
    this.showIdle = false;
    this.showEnemyIdle = false;

    this.http.post<any>('http://localhost:3000/api/battle/attack', {
      playerId: this.player.ID,
      missionId: this.missionId // <-- ahora envía missionId
    }).subscribe({
      next: (result) => {
        this.updateEnemyHP(result.enemyHP);
        setTimeout(() => {
          if (this.normalAttackVideo && this.normalAttackVideo.nativeElement) {
            const video = this.normalAttackVideo.nativeElement;
            video.currentTime = 0;
            video.play();
          }
        });
      },
      error: () => {
        this.canAttack = true;
      }
    });
  }

  onAttackVideoEnded(video: HTMLVideoElement): void {
    video.hidden = true;
    this.showIdle = true;
    this.showEnemyIdle = true;

    setTimeout(() => {
      this.showEnemyIdle = false;
      this.showEnemyAttack = true;
      this.showPlayerDamaged = true; // Aquí puedes mostrar el daño al jugador
      this.http.post<any>('http://localhost:3000/api/battle/enemy-attack', {
        playerId: this.player.ID,
        missionId: this.missionId
      }).subscribe({
        next: (result) => {
          this.player.HP = result.playerHP;
          // Si la vida del jugador llega a 0, redirige a misiones
          // Puedes mostrar el daño recibido: result.damage
        }
      });
      setTimeout(() => {
        if (this.attackEnemyVideo && this.attackEnemyVideo.nativeElement) {
          const enemyVideo = this.attackEnemyVideo.nativeElement;
          enemyVideo.currentTime = 0;
          enemyVideo.play();
        }
      });
    }, 500);
  }

  onEnemyAttackEnded(video: HTMLVideoElement): void {
    video.hidden = true;
    this.showEnemyAttack = false;
    this.showEnemyIdle = true;

    // Redirige si la vida del jugador es 0 o menos
    if (this.player.HP <= 0) {
      this.router.navigate(['/missions']);
      return;
    }

    setTimeout(() => {
      this.showPlayerDamaged = false; // Volver a idle después del daño
      this.canAttack = true; // Habilitar el siguiente turno del jugador
    }); // Ajusta el tiempo según la duración del video de daño
  }
}
