import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SidebarComponent } from '../../components/sidebar/sidebar.component';
import { TopbarComponent } from '../../components/topbar/topbar.component';
import { FooterComponent } from '../../components/footer/footer.component';
import { ChatbotComponent } from '../../components/chatbot/chatbot.component';

/**
 * Marco de la aplicacion: barra superior, menu, contenido, pie y asistente.
 *
 * <p>Las rutas cuelgan de este componente como hijas, de modo que /login y /registro
 * quedan fuera del marco y se ven solas, sin menu ni distractions. Es la razon de que
 * el marco sea una ruta y no algo dibujado siempre por AppComponent.
 */
@Component({
  selector: 'app-shell',
  standalone: true,
  imports: [RouterOutlet, SidebarComponent, TopbarComponent, FooterComponent, ChatbotComponent],
  templateUrl: './shell.component.html'
})
export class ShellComponent {}