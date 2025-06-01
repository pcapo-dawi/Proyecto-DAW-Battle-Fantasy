import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { MatIconModule } from '@angular/material/icon'

@Component({
  selector: 'app-profile-header',
  imports: [CommonModule, RouterModule, MatIconModule],
  standalone: true,
  templateUrl: './profile-header.component.html',
  styleUrl: './profile-header.component.scss'
})
export class ProfileHeaderComponent {

  constructor(
    private cookieService: CookieService,
    private router: Router
  ) { }

  logout(): void {
    this.cookieService.deleteAll();
    this.router.navigate([{ outlets: { primary: 'login', header: 'login' } }]);
  }

}
