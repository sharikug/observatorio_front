import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import * as echarts from 'echarts/core';
import { BarChart, HeatmapChart, PieChart, TreemapChart } from 'echarts/charts';
import { GridComponent, LegendComponent, TooltipComponent, VisualMapComponent } from 'echarts/components';
import { CanvasRenderer } from 'echarts/renderers';
import type { EChartsCoreOption } from 'echarts/core';
import { ObservatorioService } from '../../services/observatorio.service';
import { ProyectoRow } from '../../models/observatorio.models';
import {
  PALETA,
  opcionesBarra,
  opcionesDona,
  opcionesHeatmap,
  opcionesTreemap
} from '../../services/charts.util';

echarts.use([BarChart, PieChart, HeatmapChart, TreemapChart, GridComponent, TooltipComponent, LegendComponent, VisualMapComponent, CanvasRenderer]);

interface Filtros {
  year: string;
  conv: string;
  faculty: string;
  regional: string;
  researchType: string;
  convenio: string;
  program: string;
}

interface Kpi {
  label: string;
  value: string;
  sub: string;
}

const STOP = new Set([
  'para', 'como', 'sobre', 'entre', 'desde', 'hasta', 'hacia', 'durante', 'mediante', 'segun', 'sin', 'con', 'por', 'del', 'de',
  'la', 'las', 'los', 'el', 'en', 'y', 'e', 'o', 'u', 'un', 'una', 'unos', 'unas', 'que', 'se', 'su', 'sus', 'al', 'es', 'son',
  'ser', 'fue', 'han', 'ha', 'tiene', 'tienen', 'tener', 'busca', 'objetivo', 'general', 'partir', 'traves', 'realizar',
  'establecer', 'determinar', 'analizar', 'evaluar', 'disenar', 'desarrollar', 'identificar', 'caracterizar', 'proponer',
  'generar', 'implementar', 'estudiar', 'proyecto', 'investigacion', 'estudio', 'cundinamarca', 'universidad', 'departamento',
  'colombia', 'municipio', 'municipios'
]);

@Component({
  selector: 'app-dashboard-proyectos',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './dashboard-proyectos.component.html',
  styleUrl: './dashboard-proyectos.component.scss'
})
export class DashboardProyectosComponent implements OnInit, OnDestroy {
  datos: ProyectoRow[] = [];
  filtrados: ProyectoRow[] = [];
  kpis: Kpi[] = [];
  nube: SafeHtml = '';
  cargando = true;
  error = '';
  sinDatos = false;
  detalle: ProyectoRow[] = [];

  filtros: Filtros = { year: 'ALL', conv: 'ALL', faculty: 'ALL', regional: 'ALL', researchType: 'ALL', convenio: 'ALL', program: 'ALL' };
  opciones: Record<keyof Filtros, string[]> = {
    year: [], conv: [], faculty: [], regional: [], researchType: [], convenio: [], program: []
  };

  private instancias = new Map<string, echarts.ECharts>();
  private resizeListener = () => this.instancias.forEach((c) => c.resize());

  constructor(
    private observatorio: ObservatorioService,
    private cdr: ChangeDetectorRef,
    private sanitizer: DomSanitizer
  ) {}

  ngOnInit(): void {
    this.observatorio.getProyectos().subscribe({
      next: (data) => {
        this.datos = data;
        this.cargarOpciones();
        this.cargando = false;
        this.aplicar();
        window.addEventListener('resize', this.resizeListener);
      },
      error: () => {
        this.cargando = false;
        this.error = 'No se pudieron cargar los proyectos. Verifique la importacion de datos.';
      }
    });
  }

  ngOnDestroy(): void {
    window.removeEventListener('resize', this.resizeListener);
    this.instancias.forEach((c) => c.dispose());
    this.instancias.clear();
  }

  private cargarOpciones(): void {
    this.opciones.year = this.unicos(this.datos.map((d) => (d.year == null ? '' : String(d.year)))).sort((a, b) => Number(b) - Number(a));
    this.opciones.conv = this.unicos(this.datos.map((d) => d.conv));
    this.opciones.faculty = this.unicos(this.datos.map((d) => d.faculty));
    this.opciones.regional = this.unicos(this.datos.map((d) => d.regional));
    this.opciones.researchType = this.unicos(this.datos.map((d) => d.researchType));
    this.opciones.convenio = this.unicos(this.datos.map((d) => d.convenio));
    this.opciones.program = this.unicos(this.datos.map((d) => d.program));
  }

  aplicar(): void {
    const f = this.filtros;
    this.filtrados = this.datos.filter(
      (d) =>
        (f.year === 'ALL' || String(d.year) === f.year) &&
        (f.conv === 'ALL' || d.conv === f.conv) &&
        (f.faculty === 'ALL' || d.faculty === f.faculty) &&
        (f.regional === 'ALL' || d.regional === f.regional) &&
        (f.researchType === 'ALL' || d.researchType === f.researchType) &&
        (f.convenio === 'ALL' || d.convenio === f.convenio) &&
        (f.program === 'ALL' || d.program === f.program)
    );
    this.sinDatos = this.filtrados.length === 0;
    this.calcularKpis();
    this.detalle = [...this.filtrados]
      .sort((a, b) => (b.year ?? 0) - (a.year ?? 0) || a.project.localeCompare(b.project, 'es'))
      .slice(0, 100);
    this.cdr.detectChanges();
    this.dibujar();
  }

  restablecer(): void {
    this.filtros = { year: 'ALL', conv: 'ALL', faculty: 'ALL', regional: 'ALL', researchType: 'ALL', convenio: 'ALL', program: 'ALL' };
    this.aplicar();
  }

  private calcularKpis(): void {
    const arr = this.filtrados;
    const convocatorias = new Set(arr.map((d) => d.conv)).size;
    const tiposConocidos = arr.filter((d) => this.norm(d.researchType) !== 'SIN INFORMACION' && d.researchType);
    const aplicada = tiposConocidos.filter((d) => this.norm(d.researchType) === 'INVESTIGACION APLICADA').length;
    const convConocido = arr.filter((d) => d.convenio && this.norm(d.convenio) !== 'SIN INFORMACION');
    const conConvenio = convConocido.filter((d) => this.norm(d.convenio) === 'SI').length;
    const equipos = arr.filter((d) => d.teamSize != null);
    const promedio = equipos.length ? equipos.reduce((s, d) => s + (d.teamSize ?? 0), 0) / equipos.length : 0;
    const alineados = arr.filter((d) => d.lines.length > 0).length;

    this.kpis = [
      { label: 'Proyectos registrados', value: this.fmt(arr.length), sub: 'Portafolio visible segun filtros' },
      { label: 'Convocatorias representadas', value: this.fmt(convocatorias), sub: 'Convocatorias con proyectos visibles' },
      {
        label: 'Investigacion aplicada',
        value: tiposConocidos.length ? this.pct((100 * aplicada) / tiposConocidos.length) : 'N/D',
        sub: tiposConocidos.length ? `${aplicada} de ${tiposConocidos.length} con tipo informado` : 'Sin informacion'
      },
      {
        label: 'Proyectos con convenio',
        value: convConocido.length ? this.pct((100 * conConvenio) / convConocido.length) : 'N/D',
        sub: convConocido.length ? `${conConvenio} de ${convConocido.length} con dato disponible` : 'Sin informacion'
      },
      { label: 'Equipo promedio', value: equipos.length ? this.fmt(promedio, 1) : 'N/D', sub: 'Investigadores por proyecto' },
      {
        label: 'Alineacion institucional',
        value: arr.length ? this.pct((100 * alineados) / arr.length) : 'N/D',
        sub: 'Proyectos asociados a por lo menos 1 linea'
      }
    ];
  }

  private dibujar(): void {
    const arr = this.filtrados;
    this.dibujarEvolucion(arr);
    this.dibujarOrientacion(arr);
    this.dibujarHeatmap(arr);
    this.dibujarLineas(arr);
    this.dibujarOds(arr);
    this.dibujarEquipos(arr);
    this.dibujarConvocatorias(arr);
    this.dibujarNube(arr);
  }

  private dibujarEvolucion(arr: ProyectoRow[]): void {
    const anios = [...new Set(arr.map((d) => d.year).filter((y): y is number => y != null))].sort((a, b) => a - b);
    const categorias = anios.map(String);
    const periodos = [...new Set(arr.map((d) => this.periodo(d.period)).filter((p) => !!p))].sort();
    const series = periodos.map((p) => ({
      name: `Periodo ${p}`,
      data: anios.map((y) => arr.filter((d) => d.year === y && this.periodo(d.period) === p).length)
    }));
    this.render('chart-evolucion', opcionesBarra(categorias, series, false, true));
  }

  private periodo(valor: string | null): string {
    const n = this.norm(valor);
    if (n === '2' || n === 'II') return 'II';
    if (n === '1' || n === 'I') return 'I';
    return n;
  }

  private dibujarOrientacion(arr: ProyectoRow[]): void {
    const conteo = new Map<string, number>();
    arr.forEach((d) => {
      const tipo = d.researchType && this.norm(d.researchType) !== 'SIN INFORMACION' ? d.researchType : 'Sin informacion';
      conteo.set(tipo, (conteo.get(tipo) ?? 0) + 1);
    });
    const datos = [...conteo.entries()].map(([name, value]) => ({ name, value }));
    this.render('chart-orientacion', opcionesDona(datos));
  }

  private dibujarHeatmap(arr: ProyectoRow[]): void {
    const regionales = this.unicos(arr.map((d) => d.regional));
    const facultades = this.unicos(arr.map((d) => d.faculty))
      .sort((a, b) => arr.filter((d) => d.faculty === b).length - arr.filter((d) => d.faculty === a).length);
    const datos: [number, number, number][] = [];
    let max = 0;
    facultades.forEach((fac, i) => {
      regionales.forEach((reg, j) => {
        const n = arr.filter((d) => d.faculty === fac && d.regional === reg).length;
        datos.push([j, i, n]);
        if (n > max) max = n;
      });
    });
    this.render('chart-heatmap', opcionesHeatmap(regionales, facultades, datos, max));
  }

  private dibujarLineas(arr: ProyectoRow[]): void {
    const conteo = new Map<string, number>();
    arr.forEach((d) => d.lines.forEach((l) => conteo.set(l, (conteo.get(l) ?? 0) + 1)));
    const datos = [...conteo.entries()].map(([name, value]) => ({ name, value })).sort((a, b) => b.value - a.value);
    this.render('chart-lineas', opcionesTreemap(datos));
  }

  private dibujarOds(arr: ProyectoRow[]): void {
    const conteo = new Map<number, number>();
    arr.forEach((d) => d.ods.forEach((n) => conteo.set(n, (conteo.get(n) ?? 0) + 1)));
    const entradas = [...conteo.entries()].sort((a, b) => b[1] - a[1]);
    const categorias = entradas.map(([n]) => `ODS ${n}`);
    const valores = entradas.map(([, v]) => v);
    this.render('chart-ods', opcionesBarra(categorias, [{ name: 'Proyectos', data: valores }], true));
  }

  private dibujarEquipos(arr: ProyectoRow[]): void {
    const tamanos = [...new Set(arr.map((d) => d.teamSize).filter((t): t is number => t != null))].sort((a, b) => a - b);
    const valores = tamanos.map((t) => arr.filter((d) => d.teamSize === t).length);
    this.render('chart-equipos', opcionesBarra(tamanos.map(String), [{ name: 'Proyectos', data: valores }]));
  }

  private dibujarConvocatorias(arr: ProyectoRow[]): void {
    const conteo = new Map<string, number>();
    arr.forEach((d) => {
      const conv = d.conv ?? 'Sin informacion';
      conteo.set(conv, (conteo.get(conv) ?? 0) + 1);
    });
    const entradas = [...conteo.entries()].sort((a, b) => b[1] - a[1]);
    this.render('chart-convocatorias', opcionesBarra(entradas.map((e) => e[0]), [{ name: 'Proyectos', data: entradas.map((e) => e[1]) }], true));
  }

  private dibujarNube(arr: ProyectoRow[]): void {
    const conteo = new Map<string, number>();
    arr.forEach((d) => this.tokenizar(d.objective).forEach((w) => conteo.set(w, (conteo.get(w) ?? 0) + 1)));
    const palabras = [...conteo.entries()].sort((a, b) => b[1] - a[1]).slice(0, 48);
    if (!palabras.length) {
      this.nube = this.sanitizer.bypassSecurityTrustHtml('<div class="nube-vacia">No hay objetivos generales para este filtro.</div>');
      return;
    }
    const W = 720;
    const H = 410;
    const cx = W / 2;
    const cy = H / 2;
    const max = palabras[0][1];
    const min = palabras[palabras.length - 1][1];
    const ubicados: { x: number; y: number; w: number; h: number }[] = [];
    let svg = `<svg viewBox="0 0 ${W} ${H}" preserveAspectRatio="xMidYMid meet" font-family="Montserrat, sans-serif">`;
    palabras.forEach(([palabra, frecuencia], idx) => {
      const ratio = max === min ? 1 : (frecuencia - min) / (max - min);
      const fs = 15 + ratio * 31;
      const ww = palabra.length * fs * 0.56;
      const hh = fs * 1.12;
      let ubicado: { x: number; y: number; w: number; h: number } | null = null;
      for (let t = 0; t < 1100; t++) {
        const angulo = t * 0.34;
        const radio = 2.2 * Math.sqrt(t);
        const x = cx + radio * Math.cos(angulo) - ww / 2;
        const y = cy + radio * Math.sin(angulo) - hh / 2;
        const r = { x: x - 4, y: y - 2, w: ww + 8, h: hh + 4 };
        const cruza = ubicados.some((p) => !(r.x + r.w < p.x || p.x + p.w < r.x || r.y + r.h < p.y || p.y + p.h < r.y));
        if (x > 5 && y > 5 && x + ww < W - 5 && y + hh < H - 5 && !cruza) {
          ubicado = r;
          break;
        }
      }
      if (ubicado) {
        ubicados.push(ubicado);
        const color = PALETA[idx % PALETA.length];
        const x = ubicado.x + ubicado.w / 2;
        const y = ubicado.y + ubicado.h * 0.78;
        svg += `<text x="${x}" y="${y}" text-anchor="middle" font-size="${fs.toFixed(1)}" font-weight="${ratio > 0.65 ? 750 : 600}" fill="${color}"><title>${this.escape(palabra)}: ${frecuencia}</title>${this.escape(palabra)}</text>`;
      }
    });
    svg += '</svg>';
    this.nube = this.sanitizer.bypassSecurityTrustHtml(svg);
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

  private tokenizar(texto: string | null): string[] {
    return (texto ?? '')
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9\s-]/g, ' ')
      .split(/\s+/)
      .map((x) => x.trim())
      .filter((x) => x.length >= 4 && !STOP.has(x) && !/^\d+$/.test(x));
  }

  private unicos(valores: (string | null)[]): string[] {
    return [...new Set(valores.filter((v): v is string => !!v && v !== 'SIN INFORMACION'))].sort((a, b) => a.localeCompare(b, 'es'));
  }

  private norm(valor: string | null): string {
    return (valor ?? '').toUpperCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').trim();
  }

  private fmt(n: number, d = 0): string {
    return Number(n ?? 0).toLocaleString('es-CO', { minimumFractionDigits: d, maximumFractionDigits: d });
  }

  private pct(n: number): string {
    return isFinite(n) ? `${Number(n).toLocaleString('es-CO', { maximumFractionDigits: 1 })}%` : 'N/D';
  }

  private escape(valor: string): string {
    return String(valor ?? '').replace(/[&<>"']/g, (m) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' }[m] as string));
  }
}
