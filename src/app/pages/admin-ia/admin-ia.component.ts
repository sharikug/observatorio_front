import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IaService } from '../../services/ia.service';
import { IaAuditoriaItem, IaDocumento, IaIndicador } from '../../models/ia.models';

@Component({
  selector: 'app-admin-ia',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-ia.component.html',
  styleUrl: './admin-ia.component.scss'
})
export class AdminIaComponent implements OnInit {
  archivo: File | null = null;
  roles = 'PUBLICO';
  cargando = false;
  mensaje = '';
  error = '';

  documentos: IaDocumento[] = [];
  indicadores: IaIndicador[] = [];
  auditoria: IaAuditoriaItem[] = [];
  desde = '';
  hasta = '';

  contenido = { titulo: '', url: '', texto: '', roles: 'PUBLICO' };

  constructor(private ia: IaService) {}

  ngOnInit(): void {
    this.cargar();
  }

  cargar(): void {
    this.ia.getDocumentos().subscribe({ next: (d) => (this.documentos = d) });
    this.ia.getIndicadores().subscribe({ next: (i) => (this.indicadores = i) });
    this.buscarAuditoria();
  }

  seleccionar(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.archivo = input.files?.[0] ?? null;
    this.mensaje = '';
    this.error = '';
  }

  subirDocumento(): void {
    if (!this.archivo) return;
    this.cargando = true;
    this.error = '';
    this.ia.cargarDocumento(this.archivo, this.listaRoles(this.roles)).subscribe({
      next: (r) => {
        this.mensaje = `Documento "${r.nombre}" indexado (${r.fragmentos} fragmentos).`;
        this.archivo = null;
        this.cargando = false;
        this.cargar();
      },
      error: (e) => {
        this.cargando = false;
        this.error = e?.error?.message ?? 'No se pudo indexar el documento.';
      }
    });
  }

  indexarContenido(): void {
    if (!this.contenido.texto.trim() || !this.contenido.url.trim()) {
      this.error = 'Titulo, URL y texto del contenido son obligatorios.';
      return;
    }
    this.cargando = true;
    this.error = '';
    this.ia.indexarContenido(
      this.contenido.titulo || this.contenido.url,
      this.contenido.url,
      this.contenido.texto,
      this.listaRoles(this.contenido.roles)
    ).subscribe({
      next: () => {
        this.mensaje = 'Contenido institucional indexado.';
        this.contenido = { titulo: '', url: '', texto: '', roles: 'PUBLICO' };
        this.cargando = false;
        this.cargar();
      },
      error: (e) => {
        this.cargando = false;
        this.error = e?.error?.message ?? 'No se pudo indexar el contenido.';
      }
    });
  }

  buscarAuditoria(): void {
    this.ia.getAuditoria(this.desde || undefined, this.hasta || undefined).subscribe({
      next: (a) => (this.auditoria = a)
    });
  }

  exportarAuditoria(): void {
    this.ia.exportarAuditoria(this.desde || undefined, this.hasta || undefined).subscribe({
      next: (blob) => {
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'auditoria-ia.csv';
        a.click();
        URL.revokeObjectURL(url);
      }
    });
  }

  private listaRoles(valor: string): string[] {
    return valor.split(',').map((r) => r.trim().toUpperCase()).filter((r) => r.length > 0);
  }
}
