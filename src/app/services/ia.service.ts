import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {
  BorradorRequest,
  BorradorResponse,
  ChatResponse,
  IaAuditoriaItem,
  IaConector,
  IaDocumento,
  IaIndicador
} from '../models/ia.models';

@Injectable({ providedIn: 'root' })
export class IaService {
  private apiUrl = 'http://localhost:8080/api/ia';

  constructor(private http: HttpClient) {}

  chat(pregunta: string): Observable<ChatResponse> {
    return this.http.post<ChatResponse>(`${this.apiUrl}/chat`, { pregunta });
  }

  generarBorrador(request: BorradorRequest): Observable<BorradorResponse> {
    return this.http.post<BorradorResponse>(`${this.apiUrl}/reportes`, request);
  }

  getIndicadores(): Observable<IaIndicador[]> {
    return this.http.get<IaIndicador[]>(`${this.apiUrl}/indicadores`);
  }

  getConectores(): Observable<IaConector[]> {
    return this.http.get<IaConector[]>(`${this.apiUrl}/conectores`);
  }

  getDocumentos(): Observable<IaDocumento[]> {
    return this.http.get<IaDocumento[]>(`${this.apiUrl}/documentos`);
  }

  cargarDocumento(archivo: File, roles: string[]): Observable<{ id: string; nombre: string; estado: string; fragmentos: number }> {
    const datos = new FormData();
    datos.append('archivo', archivo);
    roles.forEach((r) => datos.append('roles', r));
    return this.http.post<{ id: string; nombre: string; estado: string; fragmentos: number }>(
      `${this.apiUrl}/documentos`, datos);
  }

  indexarContenido(titulo: string, url: string, texto: string, roles: string[]): Observable<unknown> {
    return this.http.post(`${this.apiUrl}/contenido`, { titulo, url, texto, roles });
  }

  getAuditoria(desde?: string, hasta?: string): Observable<IaAuditoriaItem[]> {
    return this.http.get<IaAuditoriaItem[]>(`${this.apiUrl}/auditoria`, {
      params: { ...(desde ? { desde } : {}), ...(hasta ? { hasta } : {}) }
    });
  }

  exportarAuditoria(desde?: string, hasta?: string): Observable<Blob> {
    return this.http.get(`${this.apiUrl}/auditoria/export`, {
      responseType: 'blob',
      params: { ...(desde ? { desde } : {}), ...(hasta ? { hasta } : {}) }
    });
  }
}
