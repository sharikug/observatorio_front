import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { IaService } from '../../services/ia.service';
import { AuthService } from '../../services/auth.service';
import { IaConversacion } from '../../models/ia.models';
import { MarkdownPipe } from './markdown.pipe';

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
  imports: [CommonModule, FormsModule, RouterLink, RouterLinkActive, MarkdownPipe],
  templateUrl: './chatbot.component.html',
  styleUrl: './chatbot.component.scss'
})
export class ChatbotComponent implements OnInit {
  /** Modulo de pagina completa: muestra barra lateral, historial y ocupa toda la pantalla. */
  @Input() modulo = false;

  isOpen = false;
  message = '';
  cargando = false;
  conversacionId: string | null = null;
  conversaciones: IaConversacion[] = [];
  messages: ChatMessage[] = [];
  readonly saludo = 'Hola, soy el asistente del Observatorio. Preguntame por proyectos, grupos, indicadores o documentos institucionales.';
  /** Getter, no campo: los inicializadores de campo corren antes que el constructor. */
  get esAdmin(): boolean {
    return (this.auth.getRol() ?? '').toUpperCase().includes('ADMIN');
  }
  sampleQuestions = [
    'Cuantos proyectos hay por ano?',
    'Cuales son los grupos con mas proyectos?',
    'Que significa el indicador de proyectos por ODS?',
    'Muestrame las convocatorias mas recientes'
  ];

  constructor(private ia: IaService, private auth: AuthService) {
    this.messages = [{ text: this.saludo, isUser: false }];
  }

  ngOnInit(): void {
    // El modulo es publico: sin sesion el historial tambien funciona, separado por navegador.
    if (this.modulo) {
      this.cargarConversaciones();
    }
  }

  toggleChat() { this.isOpen = !this.isOpen; }

  nuevaConversacion(): void {
    this.conversacionId = null;
    this.messages = [{ text: this.saludo, isUser: false }];
    this.message = '';
  }

  cargarConversaciones(): void {
    this.ia.getConversaciones().subscribe({ next: (c) => (this.conversaciones = c) });
  }

  abrirConversacion(id: string): void {
    this.conversacionId = id;
    this.ia.getConversacion(id).subscribe({
      next: (msjs) => {
        this.messages = msjs.map(m => ({
          text: m.contenido,
          isUser: m.rol === 'user',
          fuentes: m.fuentes ? m.fuentes.split('; ').filter(Boolean) : [],
          enAlcance: m.en_alcance
        }));
      },
      error: () => this.messages = [{ text: 'No se pudo abrir esa conversacion.', isUser: false }]
    });
  }

  borrarConversacion(id: string, evento: Event): void {
    evento.stopPropagation();
    this.ia.borrarConversacion(id).subscribe({
      next: () => {
        if (this.conversacionId === id) {
          this.nuevaConversacion();
        }
        this.cargarConversaciones();
      }
    });
  }

  sendMessage() {
    const pregunta = this.message.trim();
    if (!pregunta || this.cargando) return;
    this.messages.push({ text: pregunta, isUser: true });
    this.message = '';
    this.cargando = true;
    this.ia.chat(pregunta, this.conversacionId ?? undefined).subscribe({
      next: (r) => {
        this.messages.push({ text: r.respuesta, isUser: false, fuentes: r.fuentes, enAlcance: r.enAlcance, fuenteDatos: r.fuenteDatos });
        this.cargando = false;
        // El servidor abre la conversacion en el primer turno y devuelve su id.
        this.conversacionId = r.conversacionId;
        if (this.modulo) {
          this.cargarConversaciones();
        }
      },
      error: () => {
        this.messages.push({ text: 'No se pudo contactar el asistente. Intenta de nuevo mas tarde.', isUser: false });
        this.cargando = false;
      }
    });
  }

  askQuestion(q: string) { this.message = q; this.sendMessage(); }

  copiar(texto: string): void {
    navigator.clipboard?.writeText(texto);
  }

  trackConversacion(_: number, c: IaConversacion): string { return c.id_conversacion; }
}
