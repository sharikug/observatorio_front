import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';

@Component({
  selector: 'app-detalle-impacto',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './detalle-impacto.component.html',
  styleUrl: './detalle-impacto.component.scss'
})
export class DetalleImpactoComponent implements OnInit {
  impactCase: any;
  allCases = [
    { id: 1, title: 'Transferencia tecnológica y desarrollo de soluciones', category: 'Innovación', description: 'Proyectos de alto impacto en diversas áreas del conocimiento.', location: 'Fusagasugá', researchers: ['Mario Pelaez', 'Milton Guanaco'], institution: 'Universidad de Cundinamarca', period: '2023-2024' },
    { id: 2, title: 'Innovación en energías renovables', category: 'Energía', description: 'Desarrollo de soluciones sostenibles para comunidades.', location: 'Chía', researchers: ['Maria Milena'], institution: 'Universidad de Cundinamarca', period: '2022-2024' },
    { id: 3, title: 'Innovaciones en gestión hospitalaria', category: 'Salud', description: 'Mejora de procesos en instituciones de salud.', location: 'Girardot', researchers: ['Milton Guanaco'], institution: 'Universidad de Cundinamarca', period: '2023-2024' }
  ];
  constructor(private route: ActivatedRoute) {}
  ngOnInit() {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.impactCase = this.allCases.find(c => c.id === id) || this.allCases[0];
  }
}
