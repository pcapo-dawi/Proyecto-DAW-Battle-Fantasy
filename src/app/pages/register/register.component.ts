import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { PlayersService } from '../../players/players.service';
import { CookieService } from 'ngx-cookie-service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  imports: [CommonModule, RouterModule, FormsModule],
  standalone: true,
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent {

  public email!: string;
  public password!: string;
  public confirmPassword!: string;//Quitar esto y guardar el nombre de usuario
  public passwordError: boolean = false;
  constructor(
    public playersService: PlayersService,
    private cookieService: CookieService,
    private router: Router
  ) { }

  register() {
    // Here you would typically send the email and password to your backend for registration
    const user = { email: this.email, password: this.password };
    this.playersService.register(user).subscribe((data) => {
      this.playersService.setToken(data.token);
      this.router.navigate(['/login']); // Redirect to home or another page after successful login
      // Optionally, redirect to login or another page after successful registration
    });
  }

}
