import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-reportes',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './reportes.component.html',
  styleUrl: './reportes.component.scss'
})
export class ReportesComponent {
  filters = { fechaInicio: '', fechaFin: '', tipoInformacion: '', facultad: '', programa: '', grupoInvestigacion: '', estadoProyecto: '' };
  tiposInformacion = ['Todos', 'Proyectos', 'Publicaciones', 'Patentes', 'Eventos'];
  facultades = ['Todas', 'Ingeniería', 'Ciencias de la Salud', 'Ciencias Económicas', 'Educación', 'Derecho'];
  estados = ['Todos', 'Activo', 'En desarrollo', 'Finalizado', 'Suspendido'];
  generatedReports = [
    { name: 'Reporte Investigación 2024.pdf', date: '15/08/2024', size: '2.4 MB' },
    { name: 'Impacto Regional Q3.pdf', date: '01/08/2024', size: '1.8 MB' },
    { name: 'Publicaciones Científicas.pdf', date: '25/07/2024', size: '3.1 MB' }
  ];
  generateReport() { alert('Generando reporte...'); }
  previewReport() { alert('Vista previa del reporte...'); }
}
