import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-investigacion-cifras',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './investigacion-cifras.component.html',
  styleUrl: './investigacion-cifras.component.scss'
})
export class InvestigacionCifrasComponent {
  metrics = [
    { label: 'Proyectos Totales', value: '342', trend: '+12%' },
    { label: 'Publicaciones', value: '1,250', trend: '+8%' },
    { label: 'Patentes Registradas', value: '45', trend: '+15%' },
    { label: 'Alianzas Estratégicas', value: '78', trend: '+20%' }
  ];
  faculties = [
    { name: 'Ingeniería', projects: 85, percentage: 75 },
    { name: 'Ciencias de la Salud', projects: 72, percentage: 65 },
    { name: 'Ciencias Económicas', projects: 65, percentage: 58 },
    { name: 'Educación', projects: 58, percentage: 52 },
    { name: 'Derecho', projects: 35, percentage: 31 },
    { name: 'Ciencias Humanas', projects: 27, percentage: 24 }
  ];
  yearlyData = [
    { year: '2020', projects: 180, publications: 320 },
    { year: '2021', projects: 210, publications: 410 },
    { year: '2022', projects: 265, publications: 520 },
    { year: '2023', projects: 300, publications: 680 },
    { year: '2024', projects: 342, publications: 850 }
  ];
}
