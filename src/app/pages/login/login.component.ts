import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
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

  public email: string = '';
  public password: string = '';

  constructor(public playersService: PlayersService) {
    // You can inject the PlayersService to manage player-related data
  }

  login() {
    const user = { email: this.email, password: this.password };
    this.playersService.login(user).subscribe((data) => {
      console.log('Login successful', data);
    });
  }

}
