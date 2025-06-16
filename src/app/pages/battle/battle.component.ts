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

  cooldowns: { [abilityId: string]: number } = {};

  ultimateProgress: number = 0;
  ultimateReady: boolean = false;

  enemyUltimateProgress: number = 0;
  enemyUltimateReady: boolean = false;

  showEnemySuperAttack = false;

  uniqueAbility: any = null;

  ngOnInit() {
    this.playersService.getPlayerLogged().subscribe({
      next: (data) => {
        this.player = data.player;
        this.player.InitialHP = data.player.HP;

        //Cargar habilidades del Job del jugador
        this.http.get<any[]>(`http://localhost:3000/api/abilities/by-job/${this.player.ID_Job}`).subscribe({
          next: (abilities) => {
            this.abilities = abilities.filter(a => this.player.Level >= a.UnlockLvl);
          }
        });

        if (this.player.ID_UniqueAbility) {
          this.http.get<any>(`http://localhost:3000/api/unique-abilities/${this.player.ID_UniqueAbility}`).subscribe({
            next: (uniqueAbility) => {
              this.uniqueAbility = uniqueAbility;
            }
          });
        }

        this.route.params.subscribe(params => {
          this.missionId = params['id'];
          if (this.missionId && this.player) {
            //Carga los datos de la misión y enemigo
            this.http.get<any>(`http://localhost:3000/api/missions/${this.missionId}`).subscribe({
              next: (mission) => {
                this.missionData = mission;
                //Obtener el HP máximo original del enemigo
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

                  //Cargar cooldowns
                  if (result.activeMission.AbilityCooldowns) {
                    try {
                      this.cooldowns = JSON.parse(result.activeMission.AbilityCooldowns);
                    } catch {
                      this.cooldowns = {};
                    }
                  } else {
                    this.cooldowns = {};
                  }

                  //Cargar progreso y estado del ataque definitivo
                  this.ultimateProgress = result.activeMission.PlayerDefinitivo || 0;
                  this.ultimateReady = this.ultimateProgress >= 100;

                  this.enemyUltimateProgress = result.activeMission.EnemySuperAttack || 0;
                  this.enemyUltimateReady = this.enemyUltimateProgress >= 100;
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
  @ViewChild('superAttackEnemyVideo') superAttackEnemyVideo!: ElementRef<HTMLVideoElement>;

  canAttack = true;
  canUseSkill1 = true;
  canUseSkill2 = true;
  canUseSkill3 = true;
  canUseUniqueAbility = true;
  showIdle = true;
  showEnemyIdle = true;
  showEnemyAttack = false;
  showPlayerDamaged = false;
  showEnemyDamaged = false;
  showSkill = false;
  showDefinitivo = false;

  _lastEnemyDamage: number = 0;

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

        //Rellenar barra definitivo
        const damageToEnemy = result.damage || 0;
        let damageToPlayer = 0;
        if (typeof result.playerDamage === 'number') {
          damageToPlayer = result.playerDamage;
        } else if (typeof this.playerCurrentHP === 'number' && typeof result.playerHP === 'number') {
          damageToPlayer = this.playerCurrentHP - result.playerHP;
        }
        this.incrementUltimate(damageToEnemy, damageToPlayer);
        this.incrementEnemyUltimate(damageToEnemy);

        if (result.enemyHP === 0 && result.experience) {
          this.handleExperience(result.experience);
        }

        this.showEnemyDamaged = true;
        this.showEnemyIdle = false;

        setTimeout(() => {
          if (this.normalAttackVideo && this.normalAttackVideo.nativeElement) {
            const video = this.normalAttackVideo.nativeElement;
            video.currentTime = 0;
            video.play();
          }
        });

        setTimeout(() => {
          this.showEnemyDamaged = false;
          this.showEnemyIdle = true;
        }, 800);
      },
      error: () => {
        this.canAttack = true;
      }
    });
  }

  //Nueva función para incrementar la barra
  incrementUltimate(damageToEnemy: number, damageToPlayer: number) {
    let progress = this.ultimateProgress + damageToEnemy + (damageToPlayer * 0.1);
    if (progress > 100) progress = 100;
    if (progress < 0) progress = 0;
    this.ultimateProgress = progress;
    this.ultimateReady = this.ultimateProgress >= 100;

    //Guarda el valor en el backend
    this.http.post('http://localhost:3000/api/active-missions/update-definitivo', {
      playerId: this.player.ID,
      missionId: this.missionId,
      playerDefinitivo: this.ultimateProgress
    }).subscribe();
  }

  //Gestiona la experiencia y nivel
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

    //Actualiza los datos base del jugador
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
      this.showPlayerDamaged = true;

      this.http.post<any>('http://localhost:3000/api/battle/enemy-attack', {
        playerId: this.player.ID,
        missionId: this.missionId
      }).subscribe({
        next: (result) => {
          this.playerCurrentHP = result.playerHP;
          this._lastEnemyDamage = result.damage || 0;

          //Oculta todas las animaciones de ataque
          this.showEnemyAttack = false;
          this.showEnemySuperAttack = false;

          //Activa solo la animación correspondiente
          if (result.usedSuperAttack) {
            this.showEnemyIdle = false;
            this.showEnemySuperAttack = true;
            this.enemyUltimateProgress = 0;
            this.enemyUltimateReady = false;
          } else {
            this.showEnemyAttack = true;
          }
        }
      });

      setTimeout(() => {
        if (this.attackEnemyVideo && this.attackEnemyVideo.nativeElement && this.showEnemyAttack) {
          const enemyVideo = this.attackEnemyVideo.nativeElement;
          enemyVideo.currentTime = 0;
          enemyVideo.play();
        }
        if (this.superAttackEnemyVideo && this.superAttackEnemyVideo.nativeElement && this.showEnemySuperAttack) {
          const superVideo = this.superAttackEnemyVideo.nativeElement;
          superVideo.currentTime = 0;
          superVideo.play();
        }
      });
    }, 500);
  }

  onEnemyAttackEnded(video: HTMLVideoElement): void {
    video.hidden = true;
    this.showEnemyAttack = false;
    this.showEnemySuperAttack = false;
    this.showEnemyIdle = true;

    if (this._lastEnemyDamage) {
      this.incrementUltimate(0, this._lastEnemyDamage);
      this._lastEnemyDamage = 0;
    }

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
    if (!this.canAttack) return;
    this.canAttack = false;
    this.showIdle = false;
    this.showPlayerDamaged = false;
    this.showSkill = true;

    this.http.post<any>('http://localhost:3000/api/battle/use-ability', {
      playerId: this.player.ID,
      missionId: this.missionId,
      abilityId: ability.ID
    }).subscribe({
      next: (result) => {
        this.updateEnemyHP(result.enemyHP);
        if (result.cooldowns) this.cooldowns = result.cooldowns;
        if (result.enemyHP === 0 && result.experience) {
          this.handleExperience(result.experience);
        }
        const damageToEnemy = result.damage || 0;
        this.incrementEnemyUltimate(damageToEnemy);
      }
    });
  }

  //Cuando termina la animación de habilidad
  onSkillVideoEnded(video: HTMLVideoElement): void {
    video.hidden = true;
    this.showSkill = false;
    this.showIdle = true;
    this.canAttack = true;
  }

  useUltimate() {
    if (!this.ultimateReady) return;
    this.showDefinitivo = true;
    this.showIdle = false;
    this.showPlayerDamaged = false;
    this.showSkill = false;

    this.http.post<any>('http://localhost:3000/api/battle/use-ultimate', {
      playerId: this.player.ID,
      missionId: this.missionId
    }).subscribe({
      next: (result) => {
        this.updateEnemyHP(result.enemyHP);
        if (result.enemyHP === 0 && result.experience) {
          this.handleExperience(result.experience);
        }
        //Reinicia la barra de definitivo
        this.ultimateProgress = 0;
        this.ultimateReady = false;

        //Guarda el valor reiniciado en el backend
        this.http.post('http://localhost:3000/api/active-missions/update-definitivo', {
          playerId: this.player.ID,
          missionId: this.missionId,
          playerDefinitivo: 0
        }).subscribe();

        const damageToEnemy = result.damage || 0;
        this.incrementEnemyUltimate(damageToEnemy);
      }
    });
  }

  onDefinitivoVideoEnded(video: HTMLVideoElement): void {
    video.hidden = true;
    this.showDefinitivo = false;
    this.showIdle = true;
    this.canAttack = true;
  }

  incrementEnemyUltimate(damageReceived: number) {
    let progress = this.enemyUltimateProgress + (damageReceived);
    if (progress > 100) progress = 100;
    if (progress < 0) progress = 0;
    this.enemyUltimateProgress = progress;
    this.enemyUltimateReady = this.enemyUltimateProgress >= 100;

    this.http.post('http://localhost:3000/api/active-missions/update-enemy-superattack', {
      playerId: this.player.ID,
      missionId: this.missionId,
      enemySuperAttack: this.enemyUltimateProgress
    }).subscribe();
  }

  useUniqueAbility() {
    if (!this.canAttack || !this.uniqueAbility) return;
    //Cooldown check
    if (this.cooldowns[this.uniqueAbility.ID] && this.cooldowns[this.uniqueAbility.ID] > this.turn) return;

    this.canAttack = false;
    this.showIdle = false;
    this.showPlayerDamaged = false;
    this.showSkill = true;

    this.http.post<any>('http://localhost:3000/api/battle/use-ability', {
      playerId: this.player.ID,
      missionId: this.missionId,
      abilityId: this.uniqueAbility.ID,
      isUnique: true
    }).subscribe({
      next: (result) => {
        this.updateEnemyHP(result.enemyHP);
        if (result.cooldowns) this.cooldowns = result.cooldowns;
        if (result.enemyHP === 0 && result.experience) {
          this.handleExperience(result.experience);
        }
        const damageToEnemy = result.damage || 0;
        this.incrementEnemyUltimate(damageToEnemy);
      }
    });
  }

  //Para abilities normales
  getAbilityCooldown(ability: any): number {
    return this.cooldowns[`a_${ability.ID}`] || 0;
  }

  //Para uniqueAbility
  getUniqueAbilityCooldown(): number {
    return this.cooldowns[`u_${this.uniqueAbility.ID}`] || 0;
  }
}
