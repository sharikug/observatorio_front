import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-topbar',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './topbar.component.html',
  styleUrl: './topbar.component.scss'
})
export class TopbarComponent {
  private authService = inject(AuthService);
  private router = inject(Router);
  currentUser$ = this.authService.currentUser$;

  /**
   * En /login y /registro el boton apuntaria a la pagina que ya se esta viendo, y al
   * pulsarlo no pasaria nada. Ahi se oculta, para que todo boton visible haga algo.
   */
  get enPaginaDeAcceso(): boolean {
    return ['/login', '/registro'].includes(this.router.url.split('?')[0]);
  }

  logout() {
    this.authService.logout();
  }
}