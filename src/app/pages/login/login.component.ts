import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';

@Component({
  selector: 'app-login',
  imports: [CommonModule, RouterModule, HttpClientModule, FormsModule],
  standalone: true,
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {

  public email: string = '';
  public password: string = '';

  login() {
    // Here you would typically send the email and password to your backend for authentication
    console.log('Email:', this.email);
    console.log('Password:', this.password);
  }

}
