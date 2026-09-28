export interface ChatResponse {
  respuesta: string;
  enAlcance: boolean;
  fuentes: string[];
  sql: string;
  latenciaMs: number;
  /** Excel ACTIVO del que proviene la respuesta. */
  fuenteDatos: string;
}

export interface BorradorRequest {
  tema: string;
  filtros: string[];
}

export interface BorradorResponse {
  borrador: string;
  fuentes: string[];
  leyenda: string;
}

export interface IaDocumento {
  id_documento: string;
  nombre: string;
  tipo: string;
  fuente: string;
  roles_permitidos: string;
  estado: string;
  fecha_carga: string;
}

export interface IaIndicador {
  id_indicador: string;
  nombre: string;
  definicion: string;
  formula: string;
  unidad: string;
  fuente: string;
  enlace: string;
  version: number;
}

export interface IaAuditoriaItem {
  id_auditoria: number;
  email: string;
  rol: string;
  pregunta: string;
  fragmentos: string;
  sql_generado: string;
  respuesta: string;
  en_alcance: boolean;
  latencia_ms: number;
  fecha: string;
}

export interface IaConector {
  id: string;
  descripcion: string;
}
