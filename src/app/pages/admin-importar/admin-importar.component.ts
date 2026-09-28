import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ObservatorioService } from '../../services/observatorio.service';
import {
  ExcelCargadoItem,
  ExcelHistorial,
  ImportarResumen,
  TipoInconsistencia,
  ValidacionResultado,
  esCritico
} from '../../models/observatorio.models';

type Paso = 'seleccion' | 'validando' | 'validado' | 'inconsistencias';

@Component({
  selector: 'app-admin-importar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './admin-importar.component.html',
  styleUrl: './admin-importar.component.scss'
})
export class AdminImportarComponent implements OnInit {
  archivo: File | null = null;
  cargando = false;
  paso: Paso = 'seleccion';
  validacion: ValidacionResultado | null = null;
  resumen: ImportarResumen | null = null;
  historial: ExcelHistorial | null = null;
  error = '';

  constructor(private observatorio: ObservatorioService) {}

  ngOnInit(): void {
    this.cargarHistorial();
  }

  get activo(): ExcelCargadoItem | null {
    return this.historial?.activo ?? null;
  }

  critico(tipo: TipoInconsistencia): boolean {
    return esCritico(tipo);
  }

  get hojasConProblemas() {
    return this.validacion?.hojas.filter(h => h.inconsistencias > 0) ?? [];
  }

  get hojasRevisadas() {
    return this.validacion?.hojas.length ?? 0;
  }

  tamano(bytes: number): string {
    if (bytes < 1024) {
      return `${bytes} B`;
    }
    if (bytes < 1024 * 1024) {
      return `${(bytes / 1024).toFixed(0)} KB`;
    }
    return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
  }

  cargarHistorial(): void {
    this.observatorio.getHistorialExcel().subscribe({
      next: (h) => (this.historial = h),
      error: () => (this.historial = null)
    });
  }

  seleccionar(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.archivo = input.files?.[0] ?? null;
    this.reiniciar();
  }

  /** Paso 1 del flujo: el backend valida, todavia no se guarda nada. */
  validar(): void {
    if (!this.archivo) {
      return;
    }
    this.paso = 'validando';
    this.error = '';
    this.observatorio.validarArchivo(this.archivo).subscribe({
      next: (v) => {
        this.validacion = v;
        this.paso = v.valido ? 'validado' : 'inconsistencias';
      },
      error: (e) => {
        this.paso = 'seleccion';
        this.error = e?.error?.message ?? 'No se pudo validar el archivo. Verifique que su sesion sea de administrador.';
      }
    });
  }

  /** "Volver y corregir": se descarta todo, el Excel activo no se toca. */
  cancelar(): void {
    this.reiniciar();
  }

  /** "Activar": deja este archivo como unico Excel activo. */
  activar(): void {
    if (!this.archivo) {
      return;
    }
    if (this.validacion && !this.validacion.valido) {
      const confirmacion = 'El archivo contiene inconsistencias. Si continua, algunos datos podrian no '
        + `procesarse correctamente.\n\n${this.validacion.criticas} error(es) critico(s) y `
        + `${this.validacion.advertencias} advertencia(s).\n\nDesea continuar de todos modos?`;
      if (!confirm(confirmacion)) {
        return;
      }
    }
    this.cargando = true;
    this.error = '';
    this.observatorio.activarExcel(this.archivo, !!this.validacion && !this.validacion.valido).subscribe({
      next: (r) => {
        this.resumen = r.importacion;
        this.cargando = false;
        this.paso = 'validado';
        this.validacion = null;
        this.cargarHistorial();
      },
      error: (e) => {
        this.cargando = false;
        this.error = e?.error?.message ?? 'No se pudo activar el archivo. Verifique que su sesion sea de administrador.';
      }
    });
  }

  descargar(item: ExcelCargadoItem): void {
    this.observatorio.descargarExcel(item.id).subscribe({
      next: (blob) => {
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = item.nombre;
        a.click();
        URL.revokeObjectURL(url);
      },
      error: () => (this.error = 'No se pudo descargar el archivo del historial.')
    });
  }

  private reiniciar(): void {
    this.paso = 'seleccion';
    this.validacion = null;
    this.resumen = null;
    this.cargando = false;
    this.error = '';
  }
}
