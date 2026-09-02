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
  user = { nombres: '', apellidos: '', email: '', telefono: '', cargo: '', password: '', confirmPassword: '', acceptData: false, acceptTerms: false };
  register() { alert('Registro exitoso...'); }
}
