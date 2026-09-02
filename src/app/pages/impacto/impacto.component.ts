import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-impacto',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './impacto.component.html',
  styleUrl: './impacto.component.scss'
})
export class ImpactoComponent {
  impactCases = [
    { id: 1, title: 'Innovaciones en gestion hospitalaria', image: 'assets/images/impacto-1.svg', active: false },
    { id: 2, title: 'Recuperacion de suelos agricolas en comunidades rurales', subtitle: 'Metodologias para recuperacion de suelos por exceso de mal uso.', image: 'assets/images/impacto-2.svg', active: true },
    { id: 3, title: 'Innovacion en energias renovables', image: 'assets/images/impacto-3.svg', active: false }
  ];
}
