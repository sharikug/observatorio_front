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
