import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IaService } from '../../services/ia.service';
import { AuthService } from '../../services/auth.service';

interface ChatMessage {
  text: string;
  isUser: boolean;
  fuentes?: string[];
  enAlcance?: boolean;
  fuenteDatos?: string;
}

@Component({
  selector: 'app-chatbot',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './chatbot.component.html',
  styleUrl: './chatbot.component.scss'
})
export class ChatbotComponent {
  isOpen = false;
  message = '';
  cargando = false;
  messages: ChatMessage[] = [
    { text: 'Hola, soy el asistente del Observatorio. Preguntame por proyectos, grupos, indicadores o documentos institucionales.', isUser: false }
  ];
  sampleQuestions = [
    'Cuantos proyectos hay por ano?',
    'Cuales son los grupos con mas proyectos?',
    'Que significa el indicador de proyectos por ODS?',
    'Muestrame las convocatorias mas recientes'
  ];

  constructor(private ia: IaService, private auth: AuthService) {}

  toggleChat() { this.isOpen = !this.isOpen; }

  sendMessage() {
    const pregunta = this.message.trim();
    if (!pregunta || this.cargando) return;
    this.messages.push({ text: pregunta, isUser: true });
    this.message = '';
    if (!this.auth.isLoggedIn()) {
      this.messages.push({ text: 'Inicia sesion para consultar el asistente con tus permisos.', isUser: false });
      return;
    }
    this.cargando = true;
    this.ia.chat(pregunta).subscribe({
      next: (r) => {
        this.messages.push({ text: r.respuesta, isUser: false, fuentes: r.fuentes, enAlcance: r.enAlcance, fuenteDatos: r.fuenteDatos });
        this.cargando = false;
      },
      error: () => {
        this.messages.push({ text: 'No se pudo contactar el asistente. Intenta de nuevo mas tarde.', isUser: false });
        this.cargando = false;
      }
    });
  }

  askQuestion(q: string) { this.message = q; this.sendMessage(); }
}
