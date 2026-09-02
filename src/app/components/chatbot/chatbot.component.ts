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
  messages: { text: string; isUser: boolean }[] = [{ text: 'En qué puedo ayudarte?', isUser: false }];
  sampleQuestions = ['¿Cuáles son los requisitos para registrarme en un grupo de investigación?', 'Muéstrame las convocatorias más recientes', '¿Cómo puedo solicitar financiación de mi proyecto?'];

  toggleChat() { this.isOpen = !this.isOpen; }
  sendMessage() {
    if (!this.message.trim()) return;
    this.messages.push({ text: this.message, isUser: true });
    this.message = '';
    setTimeout(() => { this.messages.push({ text: 'Puedo ayudarte con información sobre proyectos de investigación, analizo datos y tendencias, te puedo ayudar con inquietudes de convocatorias, requisitos y procesos de investigación.', isUser: false }); }, 1000);
  }
  askQuestion(q: string) { this.message = q; this.sendMessage(); }
}
