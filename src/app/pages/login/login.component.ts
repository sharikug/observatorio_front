import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  credentials = { email: '', password: '', rememberMe: false };
  showPassword = false;
  login() { alert('Iniciando sesión...'); }
  togglePassword() { this.showPassword = !this.showPassword; }
}
