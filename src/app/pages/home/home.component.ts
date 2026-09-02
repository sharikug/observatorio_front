import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {
  stats = [
    { number: '250+', label: 'Proyectos Activos', icon: 'P' },
    { number: '50K+', label: 'Personas Impactadas', icon: 'I' },
    { number: '180', label: 'Producción Científica', icon: 'C' },
    { number: '80+', label: 'Investigadores', icon: 'V' }
  ];
  impactCases = [
    { id: 1, title: 'Transferencia tecnológica y desarrollo de soluciones', category: 'Innovación', description: 'Proyectos de alto impacto en diversas áreas del conocimiento.' },
    { id: 2, title: 'Innovación en energías renovables', category: 'Energía', description: 'Desarrollo de soluciones sostenibles para comunidades.' },
    { id: 3, title: 'Innovaciones en gestión hospitalaria', category: 'Salud', description: 'Mejora de procesos en instituciones de salud.' },
    { id: 4, title: 'Plataforma educativa digital para inclusión', category: 'Educación', description: 'Herramientas digitales para la inclusión educativa.' },
    { id: 5, title: 'Programa de desarrollo tecnológico', category: 'Tecnología', description: 'Formación en nuevas tecnologías para el desarrollo.' },
    { id: 6, title: 'Recuperación de suelos agrícolas', category: 'Medio Ambiente', description: 'Técnicas para recuperación de suelos por mal uso.' }
  ];
  regions = ['FUSAGASUGÁ', 'CHÍA', 'GIRARDOT', 'SOACHA', 'ZIPAQUIRÁ', 'FACATATIVÁ'];
}
