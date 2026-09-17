import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ObservatorioService } from '../../services/observatorio.service';
import { ImportarResumen } from '../../models/observatorio.models';

@Component({
  selector: 'app-admin-importar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './admin-importar.component.html',
  styleUrl: './admin-importar.component.scss'
})
export class AdminImportarComponent {
  archivo: File | null = null;
  cargando = false;
  resumen: ImportarResumen | null = null;
  error = '';

  constructor(private observatorio: ObservatorioService) {}

  seleccionar(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.archivo = input.files?.[0] ?? null;
    this.resumen = null;
    this.error = '';
  }

  importar(): void {
    if (!this.archivo) {
      return;
    }
    this.cargando = true;
    this.error = '';
    this.observatorio.importar(this.archivo).subscribe({
      next: (r) => {
        this.resumen = r;
        this.cargando = false;
      },
      error: (e) => {
        this.cargando = false;
        this.error = e?.error?.message ?? 'No se pudo importar el archivo. Verifique que su sesion sea de administrador.';
      }
    });
  }
}
