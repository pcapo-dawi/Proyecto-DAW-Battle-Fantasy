import { Component, inject, ElementRef, Input, ViewChild, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Player } from '../../../../backend/models/player';
import { Mission } from '../../../../backend/models/mission';
import { MatCardModule } from '@angular/material/card';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { PlayersService } from '../../players/players.service';
import { BattleStateService } from '../../services/battle/battle-state-service.service';

@Component({
  selector: 'app-battle',
  imports: [CommonModule, MatCardModule],
  standalone: true,
  templateUrl: './battle.component.html',
  styleUrl: './battle.component.scss'
})
export class BattleComponent implements OnInit {

  missionId: number | null = null;
  missionData?: Mission;
  turn: number = 1;

  private route = inject(ActivatedRoute);
  private http = inject(HttpClient);
  private playersService = inject(PlayersService);
  private router = inject(Router);

  player: any;
  playerCurrentHP: number = 0;

  enemyInitialHP: number = 0;
  enemyCurrentHP: number = 0;
  enemyMaxHP: number = 0;

  abilities: any[] = [];

  ngOnInit() {
    this.playersService.getPlayerLogged().subscribe({
      next: (data) => {
        this.player = data.player;
        this.player.InitialHP = data.player.HP;

        // Cargar habilidades del Job del jugador
        this.http.get<any[]>(`http://localhost:3000/api/abilities/by-job/${this.player.ID_Job}`).subscribe({
          next: (abilities) => {
            this.abilities = abilities;
          }
        });

        this.route.params.subscribe(params => {
          this.missionId = params['id'];
          if (this.missionId && this.player) {
            // Carga los datos de la misión y enemigo
            this.http.get<any>(`http://localhost:3000/api/missions/${this.missionId}`).subscribe({
              next: (mission) => {
                this.missionData = mission;
                // Obtener el HP máximo original del enemigo
                if (mission.enemyId) {
                  this.http.get<any>(`http://localhost:3000/api/enemies/${mission.enemyId}`).subscribe({
                    next: (enemy) => {
                      this.enemyMaxHP = enemy.HP;
                    }
                  });
                }
              }
            });

            //Consulta si ya hay una ActiveMission y carga los HP actuales
            this.http.get<any>(`http://localhost:3000/api/active-missions/by-player/${this.player.ID}`).subscribe({
              next: (result) => {
                if (result.activeMission && result.activeMission.ID_Mission == this.missionId) {
                  this.enemyInitialHP = result.activeMission.EnemyHP;
                  this.enemyCurrentHP = result.activeMission.EnemyHP;
                  this.playerCurrentHP = result.activeMission.PlayerHP;
                  this.turn = result.activeMission.Turn || 1;
                  this.battleState.setTurn(this.turn);
                } else {
                  this.http.post<any>('http://localhost:3000/api/active-missions/start', {
                    playerId: this.player.ID,
                    missionId: this.missionId
                  }).subscribe({
                    next: (data) => {
                      this.enemyInitialHP = data.enemyHP;
                      this.enemyCurrentHP = data.enemyHP;
                      this.playerCurrentHP = data.playerHP;
                      this.turn = data.turn || 1;
                      this.battleState.setTurn(this.turn);
                    }
                  });
                }
              }
            });
          }
        });
      }
    });
  }

  constructor(
    private battleState: BattleStateService
  ) { }

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

  updateEnemyHP(newHP: number) {
    this.enemyCurrentHP = newHP;
  }

  updateTurn(newTurn: number) {
    this.turn = newTurn;
    this.battleState.setTurn(newTurn);
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
      missionId: this.missionId
    }).subscribe({
      next: (result) => {
        this.updateEnemyHP(result.enemyHP);
        this.updateTurn(result.turn || this.turn + 1);

        if (result.enemyHP === 0 && result.experience) {
          this.handleExperience(result.experience);
        }

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

  // Gestiona la experiencia y nivel
  handleExperience(expGained: number) {
    if (!this.player) return;
    let exp = this.player.Experience || 0;
    let lvl = this.player.Level || 1;
    let expToLevel = 10 * lvl;

    let attack = this.player.Attack || 1;
    let defense = this.player.Defense || 1;
    let maxHP = this.player.HP || 100;

    exp += expGained;
    let leveledUp = false;
    while (exp >= expToLevel) {
      exp -= expToLevel;
      lvl += 1;
      expToLevel = 10 * lvl;
      attack += 1;
      defense += 1;
      maxHP += 50;
      leveledUp = true;
    }
    this.player.Experience = exp;
    this.player.Level = lvl;
    this.player.Attack = attack;
    this.player.Defense = defense;
    this.player.HP = maxHP;

    // Actualiza los datos base del jugador
    this.http.post('http://localhost:3000/api/players/update-exp', {
      playerId: this.player.ID,
      experience: exp,
      level: lvl,
      attack: attack,
      defense: defense,
      hp: maxHP
    }).subscribe();
  }

  onAttackVideoEnded(video: HTMLVideoElement): void {
    video.hidden = true;
    this.showIdle = true;
    this.showEnemyIdle = true;

    setTimeout(() => {
      this.showEnemyIdle = false;
      this.showEnemyAttack = true;
      this.showPlayerDamaged = true;
      this.http.post<any>('http://localhost:3000/api/battle/enemy-attack', {
        playerId: this.player.ID,
        missionId: this.missionId
      }).subscribe({
        next: (result) => {
          this.playerCurrentHP = result.playerHP;
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

    if (this.playerCurrentHP <= 0) {
      this.router.navigate([{ outlets: { primary: 'missions', header: 'missions' } }]);
      return;
    }

    setTimeout(() => {
      this.showPlayerDamaged = false;
      this.canAttack = true;
    });
  }

  onEnemyDeadEnded(video: HTMLVideoElement): void {
    this.router.navigate([{ outlets: { primary: 'missions', header: 'missions' } }]);
  }

  useAbility(ability: any) {
    this.http.post<any>('http://localhost:3000/api/battle/use-ability', {
      playerId: this.player.ID,
      missionId: this.missionId,
      abilityId: ability.ID
    }).subscribe({
      next: (result) => {
        this.updateEnemyHP(result.enemyHP);
        this.updateTurn(result.turn || this.turn + 1);

        if (result.enemyHP === 0 && result.experience) {
          this.handleExperience(result.experience);
        }
        // ...más lógica si necesitas...
      }
    });
  }
}
