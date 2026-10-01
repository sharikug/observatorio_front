import { ChangeDetectorRef, Component, OnInit, ViewChild, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { DashboardReportable, ReporteHistorialItem } from '../../models/observatorio.models';
import { AuthService } from '../../services/auth.service';
import { IaService } from '../../services/ia.service';
import { ObservatorioService } from '../../services/observatorio.service';
import { MarkdownPipe } from '../../components/chatbot/markdown.pipe';
import { DashboardProyectosComponent } from '../dashboard-proyectos/dashboard-proyectos.component';
import { DashboardGruposComponent } from '../dashboard-grupos/dashboard-grupos.component';

type Tablero = 'proyectos' | 'grupos';

@Component({
  selector: 'app-reportes',
  standalone: true,
  imports: [RouterLink, FormsModule, MarkdownPipe, DashboardProyectosComponent, DashboardGruposComponent],
  templateUrl: './reportes.component.html',
  styleUrl: './reportes.component.scss'
})
export class ReportesComponent implements OnInit {
  private observatorio = inject(ObservatorioService);
  private auth = inject(AuthService);
  private ia = inject(IaService);
  private cdr = inject(ChangeDetectorRef);

  @ViewChild('tablero') tableroRef?: DashboardReportable;

  seleccion: Tablero | null = null;
  generando = false;
  avisoLogin = false;
  error = '';
  historial: ReporteHistorialItem[] = [];

  temaIa = '';
  readonly temaSugerido = 'Ej.: informe ejecutivo de produccion cientifica';
  generandoIa = false;
  borrador = '';
  borradorFuentes: string[] = [];
  leyenda = '';

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

  /** HU-07: borrador narrativo redactado por el asistente sobre las fuentes autorizadas. */
  generarBorrador(): void {
    this.error = '';
    if (!this.isLoggedIn()) {
      this.avisoLogin = true;
      return;
    }
    this.generandoIa = true;
    this.ia.generarBorrador({ tema: this.temaIa.trim(), filtros: [] }).subscribe({
      next: (r) => {
        this.borrador = r.borrador;
        this.borradorFuentes = r.fuentes;
        this.leyenda = r.leyenda;
        this.generandoIa = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.generandoIa = false;
        this.error = 'No se pudo redactar el borrador. Intenta nuevamente.';
        this.cdr.detectChanges();
      }
    });
  }

  /** HU-07: el backend arma el PDF/Word real a partir del borrador que el usuario ya leyo. */
  descargarBorrador(formato: 'pdf' | 'docx'): void {
    if (!this.borrador) return;
    this.generandoIa = true;
    this.error = '';
    this.ia.exportarBorrador(formato, this.temaIa.trim(), this.borrador, this.borradorFuentes, this.leyenda)
      .subscribe({
        next: (archivo) => {
          this.descargarBlob(archivo,
            `informe-ia-${new Date().toISOString().slice(0, 10)}.${formato}`);
          this.generandoIa = false;
          this.cdr.detectChanges();
        },
        error: () => {
          this.generandoIa = false;
          this.error = `No se pudo generar el archivo ${formato.toUpperCase()}.`;
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
