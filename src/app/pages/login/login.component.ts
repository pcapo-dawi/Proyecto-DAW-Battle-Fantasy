import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { PlayersService } from '../../players/players.service';

@Component({
  selector: 'app-login',
  imports: [CommonModule, RouterModule, FormsModule],
  standalone: true,
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {

  public email!: string;
  public password!: string;
  public errorMessage: string = '';

  constructor(
    public playersService: PlayersService,
    private cookieService: PlayersService,
    public router: Router
  ) {
  }

  login() {
    this.errorMessage = '';
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!this.email || !emailPattern.test(this.email)) {
      this.errorMessage = 'Please enter a valid email address.';
      return;
    }
    if (!this.password) {
      this.errorMessage = 'Please enter your password.';
      return;
    }
    const user = { email: this.email, password: this.password };
    this.playersService.login(user).subscribe({
      next: (data) => {
        this.playersService.setToken(data.token);
        this.router.navigate(['/']);
      },
      error: (err) => {
        if (err.status === 401 || err.status === 404) {
          this.errorMessage = 'Incorrect email or password, or user does not exist.';
        } else {
          this.errorMessage = 'An error occurred. Please try again.';
        }
      }
    });
  }

}
