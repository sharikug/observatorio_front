import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-registro',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './registro.component.html',
  styleUrl: './registro.component.scss'
})
export class RegistroComponent {
  roles = ['Estudiante', 'Administrativo', 'Docente'];
  user = { cedula: '', nombres: '', apellidos: '', email: '', telefono: '', rol: 'Estudiante', password: '', confirmPassword: '', acceptData: false, acceptTerms: false };
  errorMessage = '';
  loading = false;

  constructor(private authService: AuthService, private router: Router) {}

  register() {
    this.errorMessage = '';
    if (!this.user.cedula || !this.user.nombres || !this.user.apellidos || !this.user.email || !this.user.password) {
      this.errorMessage = 'Completa todos los campos obligatorios';
      return;
    }
    if (this.user.password !== this.user.confirmPassword) {
      this.errorMessage = 'Las contrasenas no coinciden';
      return;
    }
    if (!this.user.acceptData || !this.user.acceptTerms) {
      this.errorMessage = 'Debes aceptar el tratamiento de datos y los terminos y condiciones';
      return;
    }
    this.loading = true;
    this.authService.registro({
      idcard: this.user.cedula,
      name: this.user.nombres,
      lastname: this.user.apellidos,
      email: this.user.email,
      password: this.user.password,
      phone: this.user.telefono,
      rol: this.user.rol
    }).subscribe({
      next: (response) => {
        this.authService.setSession(response);
        this.router.navigate(['/home']);
      },
      error: (err) => {
        this.loading = false;
        this.errorMessage = err.error?.message ?? 'No se pudo completar el registro';
      }
    });
  }
}