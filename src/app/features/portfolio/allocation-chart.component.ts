import {
  ChangeDetectionStrategy,
  Component,
  effect,
  ElementRef,
  input,
  viewChild,
} from '@angular/core';
import { arc, pie, type PieArcDatum } from 'd3-shape';
import { select } from 'd3-selection';

import type { AllocationSlice } from '../../state/portfolio/portfolio.selectors';

const SLICE_COLORS = ['#22c55e', '#3b82f6', '#f59e0b', '#a855f7', '#14b8a6', '#64748b'];

@Component({
  selector: 'app-allocation-chart',
  templateUrl: './allocation-chart.component.html',
  styleUrl: './allocation-chart.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AllocationChartComponent {
  readonly data = input.required<AllocationSlice[]>();
  private readonly svgRef = viewChild.required<ElementRef<SVGSVGElement>>('chartRoot');
  private readonly width = 260;
  private readonly height = 260;

  constructor() {
    effect(() => {
      this.render(this.data());
    });
  }

  private render(slices: AllocationSlice[]): void {
    const svgEl = this.svgRef().nativeElement;
    const radius = Math.min(this.width, this.height) / 2 - 8;

    const svg = select(svgEl).attr('viewBox', `0 0 ${this.width} ${this.height}`);
    const rootJoin = svg.selectAll<SVGGElement, null>('g.allocation-chart__root').data([null]);
    rootJoin
      .enter()
      .append('g')
      .attr('class', 'allocation-chart__root')
      .attr('transform', `translate(${this.width / 2},${this.height / 2})`);

    const root = svg.select<SVGGElement>('g.allocation-chart__root');
    const pieGen = pie<AllocationSlice>()
      .value((d) => d.value)
      .sort(null);
    const arcGen = arc<PieArcDatum<AllocationSlice>>().innerRadius(0).outerRadius(radius);
    const arcs = pieGen(slices);

    const sliceJoin = root
      .selectAll<SVGPathElement, PieArcDatum<AllocationSlice>>('path.allocation-chart__slice')
      .data(arcs, (d) => d.data.symbol);

    sliceJoin.exit().remove();

    sliceJoin
      .enter()
      .append('path')
      .attr('class', 'allocation-chart__slice')
      .merge(sliceJoin)
      .attr('fill', (_, index) => SLICE_COLORS[index % SLICE_COLORS.length] ?? '#64748b')
      .attr('d', (d) => arcGen(d) ?? '');
  }
}
