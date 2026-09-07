import { Component, ChangeDetectorRef, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import * as echarts from 'echarts/core';
import { BarChart, LineChart, PieChart } from 'echarts/charts';
import { GridComponent, LegendComponent, TooltipComponent } from 'echarts/components';
import { CanvasRenderer } from 'echarts/renderers';
import type { EChartsCoreOption } from 'echarts/core';
import { InvestigacionService } from '../../services/investigacion.service';
import { AuthService } from '../../services/auth.service';
import { ChartConfig, Kpi } from '../../models/investigacion.models';
import { Subscription } from 'rxjs';

echarts.use([BarChart, LineChart, PieChart, GridComponent, TooltipComponent, LegendComponent, CanvasRenderer]);

@Component({
  selector: 'app-investigacion-cifras',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './investigacion-cifras.component.html',
  styleUrl: './investigacion-cifras.component.scss'
})
export class InvestigacionCifrasComponent implements OnInit, OnDestroy {
  kpis: Kpi[] = [];
  charts: ChartConfig[] = [];
  loading = true;
  error = '';
  powerBiUrl = '';
  isLoggedIn = false;

  private chartInstances: echarts.ECharts[] = [];
  private resizeListener = () => this.chartInstances.forEach((c) => c.resize());
  private authSubscription: Subscription | null = null;

  private defaultColors = ['#79c000', '#007b3e', '#00a99d', '#daaa00', '#f7931e', '#00482b'];

  constructor(
    private investigacionService: InvestigacionService,
    private authService: AuthService,
    private cdr: ChangeDetectorRef,
    private sanitizer: DomSanitizer
  ) {}

  get safePowerBiUrl(): SafeResourceUrl | null {
    if (this.powerBiUrl && this.powerBiUrl.startsWith('https://app.powerbi.com')) {
      return this.sanitizer.bypassSecurityTrustResourceUrl(this.powerBiUrl);
    }
    return null;
  }

  ngOnInit(): void {
    this.authSubscription = this.authService.currentUser$.subscribe((user) => {
      this.isLoggedIn = !!user;
      this.cdr.detectChanges();
    });
    this.investigacionService.getDatos().subscribe({
      next: (data) => {
        this.kpis = data.kpis;
        this.charts = data.charts;
        this.powerBiUrl = data.powerBiUrl ?? '';
        this.loading = false;
        this.cdr.detectChanges();
        this.initCharts();
        window.addEventListener('resize', this.resizeListener);
      },
      error: () => {
        this.loading = false;
        this.error = 'No se pudieron cargar los datos de investigacion.';
      }
    });
  }

  ngOnDestroy(): void {
    this.authSubscription?.unsubscribe();
    window.removeEventListener('resize', this.resizeListener);
    this.chartInstances.forEach((c) => c.dispose());
    this.chartInstances = [];
  }

  private initCharts(): void {
    this.charts.forEach((chart) => {
      const element = document.getElementById(`chart-${chart.id}`);
      if (!element) return;
      const instance = echarts.init(element);
      instance.setOption(this.buildOption(chart));
      this.chartInstances.push(instance);
    });
  }

  private buildOption(chart: ChartConfig): EChartsCoreOption {
    switch (chart.type) {
      case 'pie':
        return this.buildPieOption(chart);
      case 'line':
        return this.buildLineOption(chart);
      default:
        return this.buildBarOption(chart);
    }
  }

  private buildBarOption(chart: ChartConfig): EChartsCoreOption {
    return {
      color: this.defaultColors,
      tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } },
      legend: { top: 0, textStyle: { color: '#4d4d4d', fontSize: 13 } },
      grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
      xAxis: { type: 'category', data: chart.categories ?? [], axisLabel: { fontSize: 12, color: '#4d4d4d' } },
      yAxis: { type: 'value', axisLabel: { fontSize: 12, color: '#4d4d4d' } },
      series: (chart.series ?? []).map((s) => ({
        name: s.name,
        type: 'bar',
        data: s.data as number[],
        barMaxWidth: 44,
        itemStyle: { borderRadius: [6, 6, 0, 0] }
      }))
    };
  }

  private buildLineOption(chart: ChartConfig): EChartsCoreOption {
    return {
      color: this.defaultColors,
      tooltip: { trigger: 'axis' },
      legend: { top: 0, textStyle: { color: '#4d4d4d', fontSize: 13 } },
      grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
      xAxis: { type: 'category', boundaryGap: false, data: chart.categories ?? [], axisLabel: { fontSize: 12, color: '#4d4d4d' } },
      yAxis: { type: 'value', axisLabel: { fontSize: 12, color: '#4d4d4d' } },
      series: (chart.series ?? []).map((s) => ({
        name: s.name,
        type: 'line',
        smooth: true,
        symbolSize: 8,
        data: s.data as number[],
        areaStyle: { opacity: 0.12 }
      }))
    };
  }

  private buildPieOption(chart: ChartConfig): EChartsCoreOption {
    const serie = (chart.series ?? [])[0];
    return {
      color: this.defaultColors,
      tooltip: { trigger: 'item', formatter: '{b}: {c} ({d}%)' },
      legend: { bottom: 0, textStyle: { color: '#4d4d4d', fontSize: 13 } },
      series: [
        {
          name: serie?.name ?? chart.title,
          type: 'pie',
          radius: ['38%', '68%'],
          center: ['50%', '45%'],
          avoidLabelOverlap: true,
          itemStyle: { borderRadius: 6, borderColor: '#fff', borderWidth: 2 },
          label: { show: false },
          emphasis: { label: { show: true, fontSize: 15, fontWeight: 'bold' } },
          data: (serie?.data as { name: string; value: number }[]) ?? []
        }
      ]
    };
  }
}