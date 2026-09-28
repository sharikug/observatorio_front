export interface ProyectoRow {
  year: number | null;
  period: string | null;
  conv: string | null;
  code: string;
  project: string;
  pi: string | null;
  regional: string | null;
  faculty: string | null;
  program: string | null;
  researchType: string | null;
  convenio: string | null;
  teamSize: number | null;
  lines: string[];
  ods: number[];
  objective: string | null;
}

export interface GrupoInfo {
  id: string;
  display: string;
  full: string;
  leader: string | null;
  faculty: string | null;
  regional: string | null;
  programs: string[];
}

export interface ParticipanteGrupo {
  group: string;
  investigator: string | null;
  role: string | null;
}

export interface GrupoEnProyecto {
  group: string;
  role: string | null;
}

export interface GrupoProyecto {
  id: string;
  year: number | null;
  conv: string | null;
  participants: ParticipanteGrupo[];
  groups: GrupoEnProyecto[];
}

export interface ColaboracionGrupo {
  project: string;
  origin: string;
  originName: string;
  target: string;
  targetName: string;
}

export interface GruposDashboard {
  grupos: GrupoInfo[];
  proyectos: GrupoProyecto[];
  colaboraciones: ColaboracionGrupo[];
}

export interface ImportarError {
  hoja: string;
  fila: number;
  campo: string;
  mensaje: string;
}

export interface ImportarResumen {
  creados: number;
  actualizados: number;
  omitidos: number;
  errores: ImportarError[];
}

export type TipoInconsistencia =
  | 'ARCHIVO_NO_EXCEL' | 'ARCHIVO_CORRUPTO' | 'SIN_HOJAS' | 'SIN_ENCABEZADOS'
  | 'ENCABEZADO_FALTANTE' | 'ENCABEZADO_DESCONOCIDO' | 'HOJA_FALTANTE'
  | 'HOJA_NO_RECONOCIDA' | 'HOJA_VACIA' | 'ENCABEZADO_VACIO' | 'ENCABEZADO_DUPLICADO'
  | 'FILA_VACIA' | 'COLUMNA_VACIA' | 'CELDA_VACIA' | 'TIPO_INVALIDO'
  | 'CANTIDAD_COLUMNAS' | 'DUPLICADO' | 'TRUNCADO';

export const TIPOS_CRITICOS: TipoInconsistencia[] = [
  'ARCHIVO_NO_EXCEL', 'ARCHIVO_CORRUPTO', 'SIN_HOJAS', 'SIN_ENCABEZADOS',
  'ENCABEZADO_FALTANTE', 'ENCABEZADO_DESCONOCIDO'
];

export function esCritico(tipo: TipoInconsistencia): boolean {
  return TIPOS_CRITICOS.includes(tipo);
}

export interface ValidacionInconsistencia {
  hoja: string;
  fila: number;
  columna: string;
  nombreColumna: string;
  celda: string;
  tipo: TipoInconsistencia;
  mensaje: string;
  sugerencia: string;
}

export interface ValidacionHoja {
  nombre: string;
  filas: number;
  inconsistencias: number;
  criticas: number;
}

export interface ValidacionResultado {
  archivo: string;
  valido: boolean;
  puedeContinuar: boolean;
  totalInconsistencias: number;
  criticas: number;
  advertencias: number;
  hojas: ValidacionHoja[];
  inconsistencias: ValidacionInconsistencia[];
}

export type ExcelEstado = 'ACTIVO' | 'HISTORICO' | 'RECHAZADO';

export interface ExcelCargadoItem {
  id: string;
  nombre: string;
  tamano: number;
  estado: ExcelEstado;
  fechaCarga: string;
  fechaHistorico: string;
  usuario: string;
  valido: boolean;
  criticas: number;
  advertencias: number;
  totalInconsistencias: number;
  activo: boolean;
}

export interface ExcelHistorial {
  activo: ExcelCargadoItem | null;
  historial: ExcelCargadoItem[];
}

export interface ExcelActivado {
  excel: ExcelCargadoItem;
  importacion: ImportarResumen;
}

export interface ReporteIndicador {
  etiqueta: string;
  valor: string;
}

export interface ReporteGrafico {
  titulo: string;
  imagen: string;
}

export interface ReporteDocumento {
  tablero: string;
  filtrosAplicados: string[];
  indicadores: ReporteIndicador[];
  columnas: string[];
  filas: string[][];
  graficos: ReporteGrafico[];
  fuente: string;
}

export interface ReporteHistorialItem {
  id: string;
  titulo: string;
  tipo: string;
  filtros: string;
  fecha: string;
  nombreArchivo: string;
}

export interface DashboardReportable {
  cargando: boolean;
  reportePayload(): Promise<ReporteDocumento>;
}
