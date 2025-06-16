import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { PlayersService } from '../../players/players.service';
import { CookieService } from 'ngx-cookie-service';
import { Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon'

@Component({
  selector: 'app-register',
  imports: [CommonModule, RouterModule, FormsModule, MatIconModule],
  standalone: true,
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent {

  public username!: string;
  public email!: string;
  public password!: string;
  constructor(
    public playersService: PlayersService,
    private cookieService: CookieService,
    private router: Router
  ) { }

  register() {
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!this.email || !emailPattern.test(this.email)) {
      alert('Please enter a valid email address.');
      return;
    }
    const user = { name: this.username, email: this.email, password: this.password };
    this.playersService.register(user).subscribe((data) => {
      console.log('Respuesta del backend:', data);
      this.playersService.setToken(data.token);
      this.router.navigate(['/select-job']);
    });
  }

}
