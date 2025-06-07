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

  enemyInitialHP: number = 0;
  enemyCurrentHP: number = 0;
  enemyMaxHP: number = 0;

  isRaidBattle: boolean = false;
  activeRaidPlayer: any = null;

  ngOnInit() {
    this.playersService.getPlayerLogged().subscribe({
      next: (data) => {
        this.player = data.player;
        this.player.InitialHP = data.player.HP;
        this.route.params.subscribe(params => {
          this.missionId = params['id'];
          if (this.missionId && this.player) {
            // Detecta si es raid o misión normal
            this.http.get<any>(`http://localhost:3000/api/active-raid-player/by-player/${this.player.ID}`)
              .subscribe({
                next: (result) => {
                  if (result.activeRaidPlayer && result.activeRaidPlayer.ID_ActiveRaid == this.missionId) {
                    this.isRaidBattle = true;
                    this.activeRaidPlayer = result.activeRaidPlayer;
                    // Carga datos de la raid
                    this.enemyInitialHP = result.activeRaidPlayer.EnemyHP;
                    this.enemyCurrentHP = result.activeRaidPlayer.EnemyHP;
                    this.enemyMaxHP = result.activeRaidPlayer.EnemyHP; // Si quieres mostrar barra completa
                    this.player.HP = result.activeRaidPlayer.PlayerHP;
                    this.turn = result.activeRaidPlayer.RaidTurn || 1;
                    this.battleState.setTurn(this.turn);
                  } else {
                    this.isRaidBattle = false;
                    // Carga datos de la misión y enemigo (como ya tienes)
                    this.http.get<any>(`http://localhost:3000/api/missions/${this.missionId}`).subscribe({
                      next: (mission) => {
                        this.missionData = mission;
                        if (mission.enemyId) {
                          this.http.get<any>(`http://localhost:3000/api/enemies/${mission.enemyId}`).subscribe({
                            next: (enemy) => {
                              this.enemyMaxHP = enemy.HP;
                            }
                          });
                        }
                      }
                    });
                    this.http.get<any>(`http://localhost:3000/api/active-missions/by-player/${this.player.ID}`).subscribe({
                      next: (result) => {
                        if (result.activeMission && result.activeMission.ID_Mission == this.missionId) {
                          this.enemyInitialHP = result.activeMission.EnemyHP;
                          this.enemyCurrentHP = result.activeMission.EnemyHP;
                          this.player.HP = result.activeMission.PlayerHP;
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
                              this.player.HP = data.playerHP;
                              this.turn = data.turn || 1;
                              this.battleState.setTurn(this.turn);
                            }
                          });
                        }
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
    if (!this.canAttack || !this.player) return;
    this.canAttack = false;
    this.showIdle = false;
    this.showEnemyIdle = false;

    if (this.isRaidBattle) {
      // Ataca en la raid
      this.http.post<any>('http://localhost:3000/api/raid-battle/attack', {
        playerId: this.player.ID,
        activeRaidId: this.missionId
      }).subscribe({
        next: (result) => {
          this.updateEnemyHP(result.enemyHP);
          this.updateTurn(result.turn || this.turn + 1);
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
    } else {
      // Ataca en misión normal
      this.http.post<any>('http://localhost:3000/api/battle/attack', {
        playerId: this.player.ID,
        missionId: this.missionId
      }).subscribe({
        next: (result) => {
          this.updateEnemyHP(result.enemyHP);
          this.updateTurn(result.turn || this.turn + 1);
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
  }

  onAttackVideoEnded(video: HTMLVideoElement): void {
    video.hidden = true;
    this.showIdle = true;
    this.showEnemyIdle = true;

    setTimeout(() => {
      this.showEnemyIdle = false;
      this.showEnemyAttack = true;
      this.showPlayerDamaged = true;
      if (this.isRaidBattle) {
        this.http.post<any>('http://localhost:3000/api/raid-battle/enemy-attack', {
          playerId: this.player.ID,
          activeRaidId: this.missionId
        }).subscribe({
          next: (result) => {
            this.player.HP = result.playerHP;
          }
        });
      } else {
        this.http.post<any>('http://localhost:3000/api/battle/enemy-attack', {
          playerId: this.player.ID,
          missionId: this.missionId
        }).subscribe({
          next: (result) => {
            this.player.HP = result.playerHP;
          }
        });
      }
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

    if (this.player.HP <= 0) {
      if (this.isRaidBattle) {
        this.router.navigate([{ outlets: { primary: 'raids', header: 'raids' } }]);
      } else {
        this.router.navigate([{ outlets: { primary: 'missions', header: 'missions' } }]);
      }
      return;
    }

    setTimeout(() => {
      this.showPlayerDamaged = false;
      this.canAttack = true;
    });
  }

  onEnemyDeadEnded(video: HTMLVideoElement): void {
    if (this.isRaidBattle) {
      // Llama al endpoint para borrar la raid
      this.http.delete(`http://localhost:3000/api/raids/${this.missionId}/end`)
        .subscribe({
          next: () => {
            this.router.navigate([{ outlets: { primary: 'raids', header: 'raids' } }]);
          }
        });
    } else {
      this.router.navigate([{ outlets: { primary: 'missions', header: 'missions' } }]);
    }
  }
}
