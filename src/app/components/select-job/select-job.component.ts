import { Component, Input } from '@angular/core';
import { Jobs } from '../../../../backend/models/jobs';
import { JobAspect } from '../../../../backend/models/job-aspect';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-select-job',
  imports: [CommonModule, MatCardModule, RouterModule],
  templateUrl: './select-job.component.html',
  styleUrl: './select-job.component.scss'
})
export class SelectJobComponent {
  @Input() job!: Jobs;
  @Input() jobAspect!: JobAspect;

  ngOnInit() {
    console.log(this.job);
  }
}
