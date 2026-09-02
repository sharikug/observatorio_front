import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-registro',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './registro.component.html',
  styleUrl: './registro.component.scss'
})
export class RegistroComponent {
  user = { nombres: '', apellidos: '', email: '', telefono: '', cargo: '', password: '', confirmPassword: '', acceptTerms: false, acceptData: false };
  showPassword = false;
  register() {
    if (this.user.password !== this.user.confirmPassword) { alert('Las contraseñas no coinciden'); return; }
    if (!this.user.acceptTerms || !this.user.acceptData) { alert('Debe aceptar los términos y condiciones'); return; }
    alert('Registro exitoso...');
  }
  togglePassword() { this.showPassword = !this.showPassword; }
}
