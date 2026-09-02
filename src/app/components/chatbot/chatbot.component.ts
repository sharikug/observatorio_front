import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

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
  messages: { text: string; isUser: boolean }[] = [{ text: 'En que puedo ayudarte?', isUser: false }];
  sampleQuestions = ['Como puedo solicitar financiacion de mi proyecto?', 'Muestrame las convocatorias mas recientes de la universidad.', 'Indicame los requisitos para registrarme en un grupo de investigacion?'];
  toggleChat() { this.isOpen = !this.isOpen; }
  sendMessage() {
    if (!this.message.trim()) return;
    this.messages.push({ text: this.message, isUser: true });
    this.message = '';
    setTimeout(() => { this.messages.push({ text: 'Puedo ayudarte con informacion sobre proyectos de investigacion, analizo datos y tendencias, te puedo ayudar con inquietudes de convocatorias, requisitos y procesos de investigacion.', isUser: false }); }, 1000);
  }
  askQuestion(q: string) { this.message = q; this.sendMessage(); }
}
