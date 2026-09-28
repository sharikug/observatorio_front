import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {
  ExcelActivado,
  ExcelHistorial,
  GruposDashboard,
  ImportarResumen,
  ProyectoRow,
  ReporteDocumento,
  ReporteHistorialItem,
  ValidacionResultado
} from '../models/observatorio.models';

@Injectable({ providedIn: 'root' })
export class ObservatorioService {
  private apiUrl = 'http://localhost:8080/api/observatorio';
  private reportesUrl = 'http://localhost:8080/api/observatorio/reportes';
  private excelUrl = 'http://localhost:8080/api/observatorio/excel';

  constructor(private http: HttpClient) {}

  getProyectos(): Observable<ProyectoRow[]> {
    return this.http.get<ProyectoRow[]>(`${this.apiUrl}/proyectos`);
  }

  getGrupos(): Observable<GruposDashboard> {
    return this.http.get<GruposDashboard>(`${this.apiUrl}/grupos`);
  }

  validarArchivo(archivo: File): Observable<ValidacionResultado> {
    const datos = new FormData();
    datos.append('archivo', archivo);
    return this.http.post<ValidacionResultado>(`${this.apiUrl}/importar/validar`, datos);
  }

  /**
   * Valida, purga los datos del Excel anterior y deja este como unico ACTIVO.
   * `confirmar` debe ir en true cuando el archivo tiene advertencias.
   */
  activarExcel(archivo: File, confirmar: boolean): Observable<ExcelActivado> {
    const datos = new FormData();
    datos.append('archivo', archivo);
    datos.append('confirmar', String(confirmar));
    return this.http.post<ExcelActivado>(`${this.excelUrl}/activar`, datos);
  }

  getHistorialExcel(): Observable<ExcelHistorial> {
    return this.http.get<ExcelHistorial>(`${this.excelUrl}/historial`);
  }

  descargarExcel(id: string): Observable<Blob> {
    return this.http.get(`${this.excelUrl}/${id}/descargar`, { responseType: 'blob' });
  }

  importar(archivo: File): Observable<ImportarResumen> {
    const datos = new FormData();
    datos.append('archivo', archivo);
    return this.http.post<ImportarResumen>(`${this.apiUrl}/importar`, datos);
  }

  generarReporte(documento: ReporteDocumento): Observable<Blob> {
    return this.http.post(`${this.reportesUrl}/generar`, documento, { responseType: 'blob' });
  }

  getHistorialReportes(): Observable<ReporteHistorialItem[]> {
    return this.http.get<ReporteHistorialItem[]>(`${this.reportesUrl}/historial`);
  }

  descargarReporte(id: string): Observable<Blob> {
    return this.http.get(`${this.reportesUrl}/${id}/descargar`, { responseType: 'blob' });
  }
}
