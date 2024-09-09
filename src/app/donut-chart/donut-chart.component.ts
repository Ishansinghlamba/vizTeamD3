import { TranslationWidth } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import * as d3 from 'd3';


@Component({
  selector: 'app-donut-chart',
  templateUrl: './donut-chart.component.html',
  styleUrls: ['./donut-chart.component.scss']
})
export class DonutChartComponent implements OnInit {
  data:any = [{"name":"<5","value":100},{"name":"5-9","value":1}]
  constructor() { }

  ngOnInit(): void {
    this.chart()
  }
  chart(){
    const data = this.data
    const width = 500;
    const height = 600;
  const radius = Math.min(width, height) / 2;

  const arc:any = d3.arc()
      .innerRadius(radius * 0.67)
      .outerRadius(radius - 1);

      const pie = d3.pie()
      .padAngle(1 / radius)
      .sort(null)
      .value((d:any) => d.value);

      const color:any = d3.scaleOrdinal()
      .domain(data.map(d => d.name))
      .range(d3.quantize(t => d3.interpolateSpectral(t * 0.8 + 0.1), data.length).reverse());

      const svg = d3.select("div#donut")
      .append("svg")
      .style("border", "1px solid black")
      .attr("width", width)
      .attr("height", height)
      .attr(
        "viewBox",
        `0 0 ${width} ${height}`
      )
      .append("g")
      .attr(
        "transform",
        "translate(" + width / 2 + "," + height / 2 + ")"
      )

      svg.append("g")
    .selectAll()
    .data(pie(data))
    .join("path")
      .attr("fill", (d:any) => color(d.data.name))
      .attr("d", arc)
    .append("title")
      .text((d:any) => `${d.data.name}: ${d.data.value.toLocaleString()}`);

      svg.append("g")
      .attr("font-family", "sans-serif")
      .attr("font-size", 12)
      .attr("text-anchor", "middle")
    .selectAll()
    .data(pie(data))
    .join("text")
      .attr("transform", d => `translate(${arc.centroid(d)})`)
      .call(text => text.append("tspan")
          .attr("y", "-0.4em")
          .attr("font-weight", "bold")
          .text((d:any) => d.data.name))
      }
}
