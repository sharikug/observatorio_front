import { Component } from '@angular/core';
import { ChatbotComponent } from '../../components/chatbot/chatbot.component';

/** HU-14/HU-41: modulo "Observatorio IA" a pantalla completa con historial lateral. */
@Component({
  selector: 'app-observatorio-ia',
  standalone: true,
  imports: [ChatbotComponent],
  template: `<app-chatbot [modulo]="true"></app-chatbot>`
})
export class ObservatorioIaComponent {
}
