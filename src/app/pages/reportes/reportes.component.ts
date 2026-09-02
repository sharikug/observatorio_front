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
  filters = { periodo: '', tipo: 'Todos', facultad: 'Todas', programa: '', grupo: '', fechaIni: '', fechaFin: '', estado: 'Todos' };
  generateReport() { alert('Generando reporte...'); }
}
