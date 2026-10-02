import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

/**
 * Solo el punto de salida de rutas. El marco (barra superior, menu, pie y asistente)
 * vive en ShellComponent, para que /login y /registro puedan quedar fuera de el.
 */
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.component.html'
})
export class AppComponent {}