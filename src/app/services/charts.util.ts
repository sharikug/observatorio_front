import type { EChartsCoreOption } from 'echarts/core';

export const PALETA = [
  '#00482b', '#007b3e', '#79c000', '#daaa00', '#00a99d',
  '#f7931e', '#406f59', '#9b7b00', '#a6beaf'
];

const ETIQUETA = { color: '#4d4d4d', fontSize: 11 };

export interface SerieSimple {
  name: string;
  data: number[];
}

export function opcionesBarra(categorias: string[], series: SerieSimple[], horizontal = false, apilada = false): EChartsCoreOption {
  const categoriasEje = { type: 'category' as const, data: categorias, axisLabel: ETIQUETA };
  const valorEje = { type: 'value' as const, axisLabel: ETIQUETA, splitLine: { lineStyle: { color: '#eef2ef' } } };
  return {
    color: PALETA,
    tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } },
    legend: { top: 4, textStyle: ETIQUETA },
    grid: { left: 12, right: 20, top: 44, bottom: 12, containLabel: true },
    xAxis: horizontal ? valorEje : categoriasEje,
    yAxis: horizontal ? { ...categoriasEje, inverse: true } : valorEje,
    series: series.map((s) => ({
      name: s.name,
      type: 'bar',
      stack: apilada ? 'total' : undefined,
      data: s.data,
      barMaxWidth: 36,
      itemStyle: { borderRadius: apilada ? 0 : [4, 4, 0, 0] }
    }))
  };
}

export function opcionesDona(datos: { name: string; value: number }[]): EChartsCoreOption {
  return {
    color: PALETA,
    tooltip: { trigger: 'item', formatter: '{b}: {c} ({d}%)' },
    legend: { bottom: 0, textStyle: ETIQUETA },
    series: [
      {
        type: 'pie',
        radius: ['42%', '68%'],
        center: ['50%', '44%'],
        itemStyle: { borderColor: '#fff', borderWidth: 2 },
        label: { show: false },
        emphasis: { label: { show: true, fontSize: 14, fontWeight: 'bold' } },
        data: datos
      }
    ]
  };
}

export function opcionesHeatmap(x: string[], y: string[], datos: [number, number, number][], max: number): EChartsCoreOption {
  return {
    tooltip: { position: 'top' },
    grid: { left: 12, right: 20, top: 16, bottom: 56, containLabel: true },
    xAxis: { type: 'category', data: x, axisLabel: { ...ETIQUETA, rotate: -25 }, splitArea: { show: true } },
    yAxis: { type: 'category', data: y, axisLabel: ETIQUETA, splitArea: { show: true } },
    visualMap: {
      min: 0,
      max: Math.max(1, max),
      calculable: true,
      orient: 'horizontal',
      left: 'center',
      bottom: 0,
      inRange: { color: ['#f4f8f6', '#b9cec4', '#5e8a75', '#00482b'] }
    },
    series: [
      {
        type: 'heatmap',
        data: datos,
        label: { show: false },
        emphasis: { itemStyle: { shadowBlur: 8, shadowColor: 'rgba(0,0,0,.3)' } }
      }
    ]
  };
}

export function opcionesTreemap(datos: { name: string; value: number }[]): EChartsCoreOption {
  return {
    color: PALETA,
    tooltip: { trigger: 'item', formatter: '{b}: {c}' },
    series: [
      {
        type: 'treemap',
        roam: false,
        nodeClick: false,
        breadcrumb: { show: false },
        label: { show: true, formatter: '{b}\n{c}', fontSize: 11, overflow: 'break' },
        data: datos
      }
    ]
  };
}

export function opcionesSunburst(datos: unknown[]): EChartsCoreOption {
  return {
    color: PALETA,
    tooltip: { trigger: 'item', formatter: '{b}: {c}' },
    series: [
      {
        type: 'sunburst',
        radius: ['15%', '90%'],
        data: datos,
        label: { fontSize: 11, minAngle: 8 },
        itemStyle: { borderColor: '#fff', borderWidth: 1 }
      }
    ]
  };
}

export function opcionesSankey(nodes: { name: string }[], links: { source: string; target: string; value: number }[]): EChartsCoreOption {
  return {
    color: PALETA,
    tooltip: { trigger: 'item', triggerOn: 'mousemove' },
    series: [
      {
        type: 'sankey',
        left: 8,
        right: 8,
        top: 16,
        bottom: 16,
        nodeWidth: 16,
        nodeGap: 12,
        data: nodes,
        links,
        lineStyle: { color: 'gradient', opacity: 0.35 },
        label: { fontSize: 11 }
      }
    ]
  };
}

export interface PuntoBurbuja {
  name: string;
  x: number;
  y: number;
  size: number;
  group: string;
}

export function opcionesBurbuja(puntos: PuntoBurbuja[], ejeX: string, ejeY: string): EChartsCoreOption {
  const grupos = [...new Set(puntos.map((p) => p.group))];
  return {
    color: PALETA,
    tooltip: {
      trigger: 'item',
      formatter: (p: { data: { name: string; value: number[] } }) =>
        `<b>${p.data.name}</b><br>${ejeX}: ${p.data.value[0]}<br>${ejeY}: ${p.data.value[1]}`
    },
    legend: { top: 4, textStyle: ETIQUETA },
    grid: { left: 12, right: 20, top: 44, bottom: 12, containLabel: true },
    xAxis: { type: 'value', name: ejeX, nameLocation: 'middle', nameGap: 26, axisLabel: ETIQUETA },
    yAxis: { type: 'value', name: ejeY, axisLabel: ETIQUETA, splitLine: { lineStyle: { color: '#eef2ef' } } },
    series: grupos.map((g) => ({
      name: g,
      type: 'scatter',
      data: puntos.filter((p) => p.group === g).map((p) => ({
        name: p.name,
        value: [p.x, p.y],
        symbolSize: p.size
      })),
      itemStyle: { opacity: 0.82, borderColor: '#fff', borderWidth: 1.5 }
    }))
  };
}
