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
    { number: '250+', label: 'Proyectos Activos' },
    { number: '180', label: 'Investigadores' },
    { number: '15', label: 'Grupos de Investigacion' },
    { number: '50K+', label: 'Personas Impactadas' }
  ];

  features = [
    { title: 'Investigacion Cientifica', desc: 'Proyectos de alto impacto en diversas areas del conocimiento.', icon: 'fas fa-flask' },
    { title: 'Analisis de Datos', desc: 'Metricas e indicadores de investigacion en tiempo real.', icon: 'fas fa-chart-line' },
    { title: 'Colaboracion', desc: 'Red de investigadores y alianzas estrategicas.', icon: 'fas fa-users' },
    { title: 'Innovacion', desc: 'Transferencia tecnologica y desarrollo de soluciones.', icon: 'fas fa-lightbulb' }
  ];

  regions = [
    { name: 'GIRARDOT', color: '#79c000' },
    { name: 'FACATATIVA', color: '#00482b' },
    { name: 'FUSAGASUGA', color: '#007b3e' },
    { name: 'CHIA', color: '#4d4d4d' },
    { name: 'ZIPAQUIRA', color: '#f7931e' },
    { name: 'UBATA', color: '#daaa00' },
    { name: 'SOACHA', color: '#00a99d' }
  ];
}
