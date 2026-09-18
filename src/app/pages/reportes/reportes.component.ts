import { ChangeDetectorRef, Component, OnInit, ViewChild, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DashboardReportable, ReporteHistorialItem } from '../../models/observatorio.models';
import { AuthService } from '../../services/auth.service';
import { ObservatorioService } from '../../services/observatorio.service';
import { DashboardProyectosComponent } from '../dashboard-proyectos/dashboard-proyectos.component';
import { DashboardGruposComponent } from '../dashboard-grupos/dashboard-grupos.component';

type Tablero = 'proyectos' | 'grupos';

@Component({
  selector: 'app-reportes',
  standalone: true,
  imports: [RouterLink, DashboardProyectosComponent, DashboardGruposComponent],
  templateUrl: './reportes.component.html',
  styleUrl: './reportes.component.scss'
})
export class ReportesComponent implements OnInit {
  private observatorio = inject(ObservatorioService);
  private auth = inject(AuthService);
  private cdr = inject(ChangeDetectorRef);

  @ViewChild('tablero') tableroRef?: DashboardReportable;

  seleccion: Tablero | null = null;
  generando = false;
  avisoLogin = false;
  error = '';
  historial: ReporteHistorialItem[] = [];

  ngOnInit(): void {
    if (this.isLoggedIn()) {
      this.cargarHistorial();
    }
  }

  isLoggedIn(): boolean {
    return this.auth.isLoggedIn();
  }

  seleccionar(tablero: Tablero): void {
    this.seleccion = tablero;
    this.error = '';
  }

  async generateReport(): Promise<void> {
    this.error = '';
    if (!this.seleccion || !this.tableroRef) {
      this.error = 'Selecciona un tablero para generar el informe.';
      return;
    }
    if (!this.isLoggedIn()) {
      this.avisoLogin = true;
      return;
    }
    this.avisoLogin = false;
    this.generando = true;
    try {
      const documento = await this.tableroRef.reportePayload();
      this.observatorio.generarReporte(documento).subscribe({
        next: (pdf) => {
          this.descargarBlob(pdf, `informe-${this.seleccion}-${new Date().toISOString().slice(0, 10)}.pdf`);
          this.generando = false;
          this.cargarHistorial();
          this.cdr.detectChanges();
        },
        error: () => {
          this.generando = false;
          this.error = 'No se pudo generar el informe. Intenta nuevamente.';
          this.cdr.detectChanges();
        }
      });
    } catch {
      this.generando = false;
      this.error = 'No se pudieron preparar las graficas del informe.';
    }
  }

  descargar(item: ReporteHistorialItem): void {
    this.observatorio.descargarReporte(item.id).subscribe({
      next: (pdf) => this.descargarBlob(pdf, item.nombreArchivo),
      error: () => {
        this.error = 'No se pudo descargar el reporte.';
        this.cdr.detectChanges();
      }
    });
  }

  private cargarHistorial(): void {
    this.observatorio.getHistorialReportes().subscribe({
      next: (historial) => {
        this.historial = historial;
        this.cdr.detectChanges();
      },
      error: () => {}
    });
  }

  private descargarBlob(blob: Blob, nombre: string): void {
    const url = URL.createObjectURL(blob);
    const enlace = document.createElement('a');
    enlace.href = url;
    enlace.download = nombre;
    enlace.click();
    URL.revokeObjectURL(url);
  }
}
