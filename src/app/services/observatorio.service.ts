import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {
  GruposDashboard,
  ImportarResumen,
  ProyectoRow,
  ReporteDocumento,
  ReporteHistorialItem
} from '../models/observatorio.models';

@Injectable({ providedIn: 'root' })
export class ObservatorioService {
  private apiUrl = 'http://localhost:8080/api/observatorio';
  private reportesUrl = 'http://localhost:8080/api/observatorio/reportes';

  constructor(private http: HttpClient) {}

  getProyectos(): Observable<ProyectoRow[]> {
    return this.http.get<ProyectoRow[]>(`${this.apiUrl}/proyectos`);
  }

  getGrupos(): Observable<GruposDashboard> {
    return this.http.get<GruposDashboard>(`${this.apiUrl}/grupos`);
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
