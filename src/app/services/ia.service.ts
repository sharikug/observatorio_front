import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {
  BorradorRequest,
  BorradorResponse,
  ChatResponse,
  IaAuditoriaItem,
  IaConector,
  IaConversacion,
  IaDocumento,
  IaIndicador,
  IaMensaje
} from '../models/ia.models';

@Injectable({ providedIn: 'root' })
export class IaService {
  private apiUrl = 'http://localhost:8080/api/ia';

  constructor(private http: HttpClient) {}

  chat(pregunta: string, conversacionId?: string): Observable<ChatResponse> {
    return this.http.post<ChatResponse>(`${this.apiUrl}/chat`, { pregunta, conversacionId });
  }

  nuevaConversacion(): Observable<{ id: string }> {
    return this.http.post<{ id: string }>(`${this.apiUrl}/conversaciones`, {});
  }

  getConversaciones(): Observable<IaConversacion[]> {
    return this.http.get<IaConversacion[]>(`${this.apiUrl}/conversaciones`);
  }

  getConversacion(id: string): Observable<IaMensaje[]> {
    return this.http.get<IaMensaje[]>(`${this.apiUrl}/conversaciones/${id}`);
  }

  borrarConversacion(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/conversaciones/${id}`);
  }

  generarBorrador(request: BorradorRequest): Observable<BorradorResponse> {
    return this.http.post<BorradorResponse>(`${this.apiUrl}/reportes`, request);
  }

  /** HU-07: descarga el borrador ya redactado como PDF o Word, sin volver a llamar al modelo. */
  exportarBorrador(formato: 'pdf' | 'docx', tema: string, borrador: string,
                   fuentes: string[], leyenda: string): Observable<Blob> {
    return this.http.post(`${this.apiUrl}/reportes/exportar`, { tema, borrador, fuentes, leyenda },
      { responseType: 'blob', params: { formato } });
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

  cargarDocumento(archivo: File, roles: string[]): Observable<{ id: string; nombre: string; estado: string; fragmentos: number; mensaje: string }> {
    const datos = new FormData();
    datos.append('archivo', archivo);
    roles.forEach((r) => datos.append('roles', r));
    return this.http.post<{ id: string; nombre: string; estado: string; fragmentos: number; mensaje: string }>(
      `${this.apiUrl}/documentos`, datos);
  }

  indexarContenido(titulo: string, url: string, texto: string, roles: string[]): Observable<unknown> {
    return this.http.post(`${this.apiUrl}/contenido`, { titulo, url, texto, roles });
  }

  /** Retira una fuente del indice. Definitivo en el backend: no hay copia del texto. */
  eliminarDocumento(id: string): Observable<{ mensaje: string; nombre: string }> {
    return this.http.delete<{ mensaje: string; nombre: string }>(
      `${this.apiUrl}/documentos/${id}`);
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
