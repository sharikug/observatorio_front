import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  credentials = { email: '', password: '', rememberMe: false };
  errorMessage = '';
  loading = false;

  constructor(private authService: AuthService, private router: Router) {}

  login() {
    this.errorMessage = '';
    if (!this.credentials.email || !this.credentials.password) {
      this.errorMessage = 'Ingresa tu correo y contrasena';
      return;
    }
    this.loading = true;
    this.authService.login({
      email: this.credentials.email,
      password: this.credentials.password
    }).subscribe({
      next: (response) => {
        this.authService.setSession(response);
        this.router.navigate(['/home']);
      },
      error: (err) => {
        this.loading = false;
        this.errorMessage = err.error?.message ?? 'No se pudo iniciar sesion';
      }
    });
  }
}