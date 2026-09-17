import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import * as echarts from 'echarts/core';
import { HeatmapChart, PieChart, SankeyChart, ScatterChart, SunburstChart } from 'echarts/charts';
import { GridComponent, LegendComponent, TooltipComponent, VisualMapComponent } from 'echarts/components';
import { CanvasRenderer } from 'echarts/renderers';
import type { EChartsCoreOption } from 'echarts/core';
import { ObservatorioService } from '../../services/observatorio.service';
import { GrupoInfo, GrupoProyecto, GruposDashboard } from '../../models/observatorio.models';
import {
  PuntoBurbuja,
  opcionesBurbuja,
  opcionesDona,
  opcionesHeatmap,
  opcionesSankey,
  opcionesSunburst
} from '../../services/charts.util';

echarts.use([HeatmapChart, PieChart, SankeyChart, ScatterChart, SunburstChart, GridComponent, TooltipComponent, LegendComponent, VisualMapComponent, CanvasRenderer]);

interface Filtros {
  year: string;
  conv: string;
  faculty: string;
  regional: string;
  program: string;
  group: string;
}

interface Kpi {
  label: string;
  value: string;
}

interface FilaGrupo {
  id: string;
  display: string;
  leader: string;
  faculty: string;
  regional: string;
  led: number;
  projects: number;
  researchers: number;
  partners: number;
  programs: string;
}

interface StatsGrupo {
  projects: Set<string>;
  led: Set<string>;
  researchers: Set<string>;
  partners: Set<string>;
}

@Component({
  selector: 'app-dashboard-grupos',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './dashboard-grupos.component.html',
  styleUrl: './dashboard-grupos.component.scss'
})
export class DashboardGruposComponent implements OnInit, OnDestroy {
  kpis: Kpi[] = [];
  detalle: FilaGrupo[] = [];
  cargando = true;
  error = '';
  sinDatos = false;

  filtros: Filtros = { year: 'ALL', conv: 'ALL', faculty: 'ALL', regional: 'ALL', program: 'ALL', group: 'ALL' };
  opciones: Record<keyof Filtros, string[]> = { year: [], conv: [], faculty: [], regional: [], program: [], group: [] };

  private meta = new Map<string, GrupoInfo>();
  private proyectos: GrupoProyecto[] = [];
  private instancias = new Map<string, echarts.ECharts>();
  private resizeListener = () => this.instancias.forEach((c) => c.resize());

  constructor(
    private observatorio: ObservatorioService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.observatorio.getGrupos().subscribe({
      next: (data: GruposDashboard) => {
        data.grupos.forEach((g) => this.meta.set(g.id, g));
        this.proyectos = data.proyectos;
        this.colaboraciones = data.colaboraciones;
        this.cargarOpciones();
        this.cargando = false;
        this.aplicar();
        window.addEventListener('resize', this.resizeListener);
      },
      error: () => {
        this.cargando = false;
        this.error = 'No se pudieron cargar los grupos. Verifique la importacion de datos.';
      }
    });
  }

  ngOnDestroy(): void {
    window.removeEventListener('resize', this.resizeListener);
    this.instancias.forEach((c) => c.dispose());
    this.instancias.clear();
  }

  private colaboraciones: GruposDashboard['colaboraciones'] = [];

  private cargarOpciones(): void {
    const grupos = [...this.meta.values()];
    this.opciones.year = [...new Set(this.proyectos.map((p) => (p.year == null ? '' : String(p.year))))].filter(Boolean).sort((a, b) => Number(b) - Number(a));
    this.opciones.conv = this.unicos(this.proyectos.map((p) => p.conv));
    this.opciones.faculty = this.unicos(grupos.map((g) => g.faculty));
    this.opciones.regional = this.unicos(grupos.map((g) => g.regional));
    this.opciones.program = this.unicos(grupos.flatMap((g) => g.programs));
    this.opciones.group = grupos.map((g) => g.id).sort((a, b) => this.display(a).localeCompare(this.display(b), 'es'));
  }

  aplicar(): void {
    const f = this.filtros;
    const elegibles = new Set(
      [...this.meta.values()]
        .filter(
          (g) =>
            (f.faculty === 'ALL' || g.faculty === f.faculty) &&
            (f.regional === 'ALL' || g.regional === f.regional) &&
            (f.program === 'ALL' || g.programs.includes(f.program)) &&
            (f.group === 'ALL' || g.id === f.group)
        )
        .map((g) => g.id)
    );

    const proyectos = this.proyectos
      .filter((p) => (f.year === 'ALL' || String(p.year) === f.year) && (f.conv === 'ALL' || p.conv === f.conv))
      .map((p) => ({
        ...p,
        participants: p.participants.filter((x) => elegibles.has(x.group)),
        groups: p.groups.filter((x) => elegibles.has(x.group))
      }))
      .filter((p) => p.participants.length > 0 || p.groups.length > 0);

    const visibles = new Set<string>();
    proyectos.forEach((p) => {
      p.participants.forEach((x) => visibles.add(x.group));
      p.groups.forEach((x) => visibles.add(x.group));
    });

    this.sinDatos = visibles.size === 0;
    if (this.sinDatos) {
      this.kpis = [];
      this.detalle = [];
      this.cdr.detectChanges();
      return;
    }

    const idsFiltrados = new Set(proyectos.map((p) => p.id));
    const stats = this.calcularStats(proyectos, visibles);
    const pares = this.agregarPares(idsFiltrados, visibles);

    const investigadores = new Set<string>();
    proyectos.forEach((p) => p.participants.forEach((x) => x.investigator && investigadores.add(x.investigator)));
    const colaborativos = proyectos.filter((p) => this.gruposDe(p).length >= 2).length;
    const promedio = proyectos.length ? proyectos.reduce((s, p) => s + this.gruposDe(p).length, 0) / proyectos.length : 0;
    const interfacultad = proyectos.filter((p) => this.facultadesDe(p).length >= 2).length;
    const conLiderazgo = [...visibles].filter((g) => (stats.get(g)?.led.size ?? 0) > 0).length;

    this.kpis = [
      { label: 'Grupos con participacion', value: this.fmt(visibles.size) },
      { label: 'Investigadores asociados', value: this.fmt(investigadores.size) },
      { label: 'Colaboracion intergrupal', value: proyectos.length ? this.pct((100 * colaborativos) / proyectos.length) : 'N/D' },
      { label: 'Grupos por proyecto', value: proyectos.length ? this.fmt(promedio, 2) : 'N/D' },
      { label: 'Colaboracion interfacultad', value: proyectos.length ? this.pct((100 * interfacultad) / proyectos.length) : 'N/D' },
      { label: 'Grupos con liderazgo', value: this.fmt(conLiderazgo) }
    ];

    this.detalle = [...visibles]
      .map((g) => {
        const s = stats.get(g);
        const info = this.meta.get(g);
        return {
          id: g,
          display: this.display(g),
          leader: info?.leader ?? '—',
          faculty: info?.faculty ?? '—',
          regional: info?.regional ?? '—',
          led: s?.led.size ?? 0,
          projects: s?.projects.size ?? 0,
          researchers: s?.researchers.size ?? 0,
          partners: s?.partners.size ?? 0,
          programs: info?.programs.join(', ') || '—'
        };
      })
      .sort((a, b) => b.projects - a.projects || a.display.localeCompare(b.display, 'es'));

    this.cdr.detectChanges();
    this.dibujar(proyectos, visibles, stats, pares);
  }

  restablecer(): void {
    this.filtros = { year: 'ALL', conv: 'ALL', faculty: 'ALL', regional: 'ALL', program: 'ALL', group: 'ALL' };
    this.aplicar();
  }

  private calcularStats(proyectos: GrupoProyecto[], visibles: Set<string>): Map<string, StatsGrupo> {
    const stats = new Map<string, StatsGrupo>();
    visibles.forEach((g) => stats.set(g, { projects: new Set(), led: new Set(), researchers: new Set(), partners: new Set() }));
    proyectos.forEach((p) => {
      this.gruposDe(p).forEach((g) => {
        if (!stats.has(g)) return;
        const s = stats.get(g)!;
        s.projects.add(p.id);
        p.groups.filter((x) => x.group === g && this.norm(x.role) === 'LIDER').forEach(() => s.led.add(p.id));
        if (p.participants.some((x) => x.group === g && this.norm(x.role).includes('PRINCIPAL'))) s.led.add(p.id);
        p.participants.filter((x) => x.group === g && x.investigator).forEach((x) => s.researchers.add(x.investigator!));
      });
    });
    return stats;
  }

  private agregarPares(idsFiltrados: Set<string>, visibles: Set<string>): Map<string, { a: string; b: string; value: number }> {
    const pares = new Map<string, { a: string; b: string; value: number }>();
    this.colaboraciones
      .filter((c) => idsFiltrados.has(c.project) && visibles.has(c.origin) && visibles.has(c.target) && c.origin !== c.target)
      .forEach((c) => {
        const [a, b] = [c.origin, c.target].sort();
        const clave = `${a}|||${b}`;
        const actual = pares.get(clave);
        if (actual) {
          actual.value++;
        } else {
          pares.set(clave, { a, b, value: 1 });
        }
      });
    return pares;
  }

  private dibujar(proyectos: GrupoProyecto[], visibles: Set<string>, stats: Map<string, StatsGrupo>, pares: Map<string, { a: string; b: string; value: number }>): void {
    const grupos = [...visibles];
    const anios = [...new Set(proyectos.map((p) => p.year).filter((y): y is number => y != null))].sort((a, b) => a - b);

    const rankeados = [...grupos].sort((a, b) => (stats.get(b)?.projects.size ?? 0) - (stats.get(a)?.projects.size ?? 0)).slice(0, 16);
    const datos: [number, number, number][] = [];
    let max = 0;
    rankeados.forEach((g, i) => {
      anios.forEach((y, j) => {
        const n = proyectos.filter((p) => p.year === y && this.gruposDe(p).includes(g)).length;
        datos.push([j, i, n]);
        if (n > max) max = n;
      });
    });
    this.render('chart-heatmap-grupos', opcionesHeatmap(anios.map(String), rankeados.map((g) => this.display(g)), datos, max));

    const facultades = this.unicos(grupos.map((g) => this.meta.get(g)?.faculty));
    const sunburst = facultades.map((f) => ({
      name: f,
      children: grupos
        .filter((g) => (this.meta.get(g)?.faculty ?? 'Sin informacion') === f)
        .map((g) => ({ name: this.display(g), value: stats.get(g)?.projects.size ?? 0 }))
    }));
    this.render('chart-sunburst', opcionesSunburst(sunburst));

    const top = [...pares.values()].sort((a, b) => b.value - a.value).slice(0, 22);
    const nodos = [...new Set(top.flatMap((e) => [e.a, e.b]))].map((id) => ({ name: this.display(id) }));
    const links = top.map((e) => ({ source: this.display(e.a), target: this.display(e.b), value: e.value }));
    this.render('chart-sankey', opcionesSankey(nodos, links));

    const aliados = new Map<string, number>();
    pares.forEach((e) => {
      aliados.set(e.a, (aliados.get(e.a) ?? 0) + 1);
      aliados.set(e.b, (aliados.get(e.b) ?? 0) + 1);
    });
    const puntos: PuntoBurbuja[] = grupos
      .map((g) => {
        const s = stats.get(g)!;
        return {
          name: this.display(g),
          x: s.led.size,
          y: aliados.get(g) ?? 0,
          size: 18 + Math.sqrt(s.projects.size) * 6,
          group: this.meta.get(g)?.faculty ?? 'Sin informacion'
        };
      })
      .filter((p) => p.x > 0 || p.y > 0);
    this.render('chart-bubble', opcionesBurbuja(puntos, 'Proyectos liderados', 'Grupos aliados'));

    let lidera = 0;
    let colabora = 0;
    grupos.forEach((g) => {
      const s = stats.get(g)!;
      s.projects.forEach((pid) => (s.led.has(pid) ? lidera++ : colabora++));
    });
    this.render('chart-roles', opcionesDona([
      { name: 'Lidera proyecto', value: lidera },
      { name: 'Participa como colaborador', value: colabora }
    ]));

    const territorial = new Map<string, number>();
    grupos.forEach((g) => {
      const reg = this.meta.get(g)?.regional ?? 'Sin informacion';
      territorial.set(reg, (territorial.get(reg) ?? 0) + 1);
    });
    this.render('chart-territorial', opcionesDona(
      [...territorial.entries()].map(([name, value]) => ({ name, value })).sort((a, b) => b.value - a.value)
    ));
  }

  private gruposDe(p: GrupoProyecto): string[] {
    return [...new Set([...p.groups.map((x) => x.group), ...p.participants.map((x) => x.group)])];
  }

  private facultadesDe(p: GrupoProyecto): string[] {
    return [...new Set(this.gruposDe(p).map((g) => this.meta.get(g)?.faculty).filter((f): f is string => !!f && this.norm(f) !== 'SIN INFORMACION'))];
  }

  private render(id: string, opcion: EChartsCoreOption): void {
    const el = document.getElementById(id);
    if (!el) return;
    let instancia = this.instancias.get(id);
    if (!instancia) {
      instancia = echarts.init(el);
      this.instancias.set(id, instancia);
    }
    instancia.setOption(opcion, true);
  }

  display(id: string): string {
    return this.meta.get(id)?.display ?? id;
  }

  private unicos(valores: (string | null | undefined)[]): string[] {
    return [...new Set(valores.filter((v): v is string => !!v && this.norm(v) !== 'SIN INFORMACION'))].sort((a, b) => a.localeCompare(b, 'es'));
  }

  private norm(valor: string | null | undefined): string {
    return (valor ?? '').toUpperCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').trim();
  }

  private fmt(n: number, d = 0): string {
    return Number(n ?? 0).toLocaleString('es-CO', { minimumFractionDigits: d, maximumFractionDigits: d });
  }

  private pct(n: number): string {
    return isFinite(n) ? `${Number(n).toLocaleString('es-CO', { maximumFractionDigits: 1 })}%` : 'N/D';
  }
}
