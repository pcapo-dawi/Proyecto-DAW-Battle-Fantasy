import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Jobs } from '../../../../backend/models/jobs';
import { SelectJobComponent } from '../../components/select-job/select-job.component';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-select-job-listing',
  imports: [CommonModule, SelectJobComponent, RouterModule],
  standalone: true,
  templateUrl: './select-job-listing.component.html',
  styleUrl: './select-job-listing.component.scss'
})
export class SelectJobListingComponent {
  public JobsList: Jobs[] = [];

  constructor(private http: HttpClient, private router: Router) {
    // You can choose which API endpoint to use, or combine them as needed.
    // Example: Use the first endpoint
    //this.http.get<Jobs[]>('http://localhost:3000/api/jobs')
    //.subscribe(data => this.JobsList = data);

    // If you want to use the second endpoint instead, comment the above and uncomment below:
    this.http.get<Jobs[]>('http://localhost:3000/api/jobs-aspect-ids')
      .subscribe(data => this.JobsList = data);
  }

}
