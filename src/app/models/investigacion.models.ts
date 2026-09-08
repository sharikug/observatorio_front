export interface Kpi {
  icon: string;
  value: string | number;
  label: string;
}

export interface SerieItem {
  name: string;
  data: number[] | { name: string; value: number }[];
}

export interface ChartConfig {
  id: string;
  type: 'bar' | 'line' | 'pie';
  title: string;
  icon?: string;
  categories?: string[];
  series?: SerieItem[];
}

export interface InvestigacionData {
  kpis: Kpi[];
  charts: ChartConfig[];
  powerBiUrl?: string;
}
