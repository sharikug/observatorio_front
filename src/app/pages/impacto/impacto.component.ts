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
    { id: 1, title: 'Transferencia tecnológica y desarrollo de soluciones', category: 'Innovación', description: 'Proyectos de alto impacto en diversas áreas del conocimiento.', location: 'Fusagasugá' },
    { id: 2, title: 'Innovación en energías renovables', category: 'Energía', description: 'Desarrollo de soluciones sostenibles para comunidades.', location: 'Chía' },
    { id: 3, title: 'Innovaciones en gestión hospitalaria', category: 'Salud', description: 'Mejora de procesos en instituciones de salud.', location: 'Girardot' },
    { id: 4, title: 'Plataforma educativa digital para inclusión', category: 'Educación', description: 'Herramientas digitales para la inclusión educativa.', location: 'Soacha' },
    { id: 5, title: 'Programa de desarrollo tecnológico', category: 'Tecnología', description: 'Formación en nuevas tecnologías para el desarrollo.', location: 'Zipaquirá' },
    { id: 6, title: 'Recuperación de suelos agrícolas', category: 'Medio Ambiente', description: 'Técnicas avanzadas para cultivos sostenibles.', location: 'Facatativá' }
  ];
  categories = ['Todos', 'Innovación', 'Energía', 'Salud', 'Educación', 'Tecnología', 'Medio Ambiente'];
  selectedCategory = 'Todos';
  filterCases(cat: string) { this.selectedCategory = cat; }
  get filteredCases() { return this.selectedCategory === 'Todos' ? this.impactCases : this.impactCases.filter(c => c.category === this.selectedCategory); }
}
