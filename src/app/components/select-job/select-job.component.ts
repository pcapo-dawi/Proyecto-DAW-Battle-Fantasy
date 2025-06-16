import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { Jobs } from '../../../../backend/models/jobs';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { RouterModule } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-select-job',
  imports: [CommonModule, MatCardModule, RouterModule],
  templateUrl: './select-job.component.html',
  styleUrl: './select-job.component.scss'
})
export class SelectJobComponent implements OnInit {
  @Input() job!: Jobs;
  @Output() selectAspect = new EventEmitter<number>();

  abilities: any[] = [];
  definitivo: any = null;

  constructor(private http: HttpClient) { }

  ngOnInit() {
    if (this.job && this.job.ID) {
      this.http.get<any[]>(`http://localhost:3000/api/abilities/by-job/${this.job.ID}`)
        .subscribe(abilities => this.abilities = abilities);

      // Cargar el Definitivo
      if (this.job.ID_Definitivo) {
        this.http.get<any>(`http://localhost:3000/api/definitivo/${this.job.ID_Definitivo}`)
          .subscribe(definitivo => this.definitivo = definitivo);
      }
    }
  }

  selectJobAspect(aspectId: number) {
    this.selectAspect.emit(aspectId);
  }
}
