import {
  ChangeDetectionStrategy,
  Component,
  effect,
  ElementRef,
  input,
  viewChild,
} from '@angular/core';
import { extent } from 'd3-array';
import { axisBottom, axisLeft } from 'd3-axis';
import { scaleLinear } from 'd3-scale';
import { select } from 'd3-selection';
import { curveMonotoneX, line } from 'd3-shape';

@Component({
  selector: 'app-price-line-chart',
  templateUrl: './price-line-chart.component.html',
  styleUrl: './price-line-chart.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PriceLineChartComponent {
  readonly symbol = input.required<string>();
  readonly prices = input.required<number[]>();
  private readonly svgRef = viewChild.required<ElementRef<SVGSVGElement>>('chartRoot');

  private readonly width = 640;
  private readonly height = 320;
  private readonly margin = { top: 16, right: 16, bottom: 32, left: 56 };
  private lastSymbol = '';

  constructor() {
    effect(() => {
      this.render(this.symbol(), this.prices());
    });
  }

  private render(symbol: string, prices: number[]): void {
    const svgEl = this.svgRef().nativeElement;
    const innerW = this.width - this.margin.left - this.margin.right;
    const innerH = this.height - this.margin.top - this.margin.bottom;

    const svg = select(svgEl).attr('viewBox', `0 0 ${this.width} ${this.height}`);

    if (symbol !== this.lastSymbol) {
      svg.selectAll('*').remove();
      this.lastSymbol = symbol;
    }

    const plotJoin = svg.selectAll<SVGGElement, null>('g.price-line-chart__plot').data([null]);
    plotJoin
      .enter()
      .append('g')
      .attr('class', 'price-line-chart__plot')
      .attr('transform', `translate(${this.margin.left},${this.margin.top})`);

    const plot = svg.select<SVGGElement>('g.price-line-chart__plot');

    if (prices.length < 2) {
      plot.selectAll('*').remove();
      plot
        .append('text')
        .attr('class', 'price-line-chart__placeholder')
        .attr('x', innerW / 2)
        .attr('y', innerH / 2)
        .attr('text-anchor', 'middle')
        .attr('fill', '#64748b')
        .text('Waiting for price ticks…');
      return;
    }

    plot.select('.price-line-chart__placeholder').remove();

    const x = scaleLinear()
      .domain([0, prices.length - 1])
      .range([0, innerW]);
    const yExtent = extent(prices) as [number, number];
    const y = scaleLinear().domain(yExtent).nice().range([innerH, 0]);

    plot.selectAll('.price-line-chart__axis').remove();
    plot
      .append('g')
      .attr('class', 'price-line-chart__axis price-line-chart__axis--x')
      .attr('transform', `translate(0,${innerH})`)
      .attr('color', '#64748b')
      .call(
        axisBottom(x)
          .ticks(6)
          .tickFormat(() => ''),
      );
    plot
      .append('g')
      .attr('class', 'price-line-chart__axis price-line-chart__axis--y')
      .attr('color', '#64748b')
      .call(
        axisLeft(y)
          .ticks(5)
          .tickFormat((value) => `${value}`),
      );

    const lineGen = line<number>()
      .x((_, index) => x(index))
      .y((value) => y(value))
      .curve(curveMonotoneX);

    const pathJoin = plot
      .selectAll<SVGPathElement, number[]>('path.price-line-chart__line')
      .data([prices]);
    pathJoin.exit().remove();
    pathJoin
      .enter()
      .append('path')
      .attr('class', 'price-line-chart__line')
      .attr('fill', 'none')
      .attr('stroke-width', 2)
      .merge(pathJoin)
      .attr('stroke', '#22c55e')
      .attr('d', lineGen);
  }
}
