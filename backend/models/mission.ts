import { Enemy } from "./enemy";

export interface Mission {
    id: number;
    name: string;
    description: string;
    time: number;
    reward: number;
    enemy: Enemy;
    enemyId: number;
    enemyHp: number;
}
