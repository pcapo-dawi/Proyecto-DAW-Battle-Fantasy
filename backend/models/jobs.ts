import { JobAspect } from './job-aspect';

export interface Jobs {
    ID: number;
    Name: string;
    Description: string;
    BaseAttack: number;
    BaseDefense: number;
    ID_Definitivo: number;
    Aspects: JobAspect[];
    aspectIds: number[];
}
