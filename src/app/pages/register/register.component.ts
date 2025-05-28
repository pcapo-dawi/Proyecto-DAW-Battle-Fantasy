import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';

@Component({
  selector: 'app-register',
  imports: [CommonModule, RouterModule, FormsModule],
  standalone: true,
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent {

  public email: string = '';
  public password: string = '';
  public confirmPassword: string = '';

  register() {
    // Here you would typically send the email and password to your backend for registration
    if (this.password === this.confirmPassword) {
      console.log('Email:', this.email);
      console.log('Password:', this.password);
    } else {
      console.error('Passwords do not match');
    }
  }

}
