import { Component, OnInit } from '@angular/core';
import * as d3 from 'd3';


@Component({
  selector: 'app-pie-chart',
  templateUrl: './pie-chart.component.html',
  styleUrls: ['./pie-chart.component.scss']
})
export class PieChartComponent implements OnInit {
data:any ={
    "user": null,
    "data": [
        {
            "inQueue": 90,
            "nominated": 92,
            "JobTypeValue": "74%",
            "review": 90,
            "color": "#C03225"
        },
        {
            "inReview": 31,
            "nominated": 92,
            "JobTypeValue": "25%",
            "review": 31,
            "color": "#5E79FF"
        },
        {
            "published": 1,
            "nominated": 92,
            "JobTypeValue": "1%",
            "review": 1,
            "color": "#00E691"
        }
    ]
}
private svg: any;
private radius = 0;


  constructor() { }

  ngOnInit(): void {
    this.radius = Math.min(220, 220) / 2 - 90;
    this.createSvg();
    this.drawChart()

  }

  private createSvg(): void {
    let tooltip;
    this.svg = d3.select("div#pie")
      .append("svg")
      .attr(
        "viewBox",
        `0 0 ${220} ${220}`
      )
      .append("g")
      .attr(
        "transform",
        "translate(" + 220/2  + "," + 220/2  + ")"
      );
      tooltip = d3.select('body').append("div")
      .classed('chart-tooltip', true)
      .style('display','none');
  }

  private drawChart(): void {
    // Compute the position of each group on the pie:
    const pie = d3.pie<any>().value((d: any) => Number(d.review));
    // Build the pie chart
    this.svg
      .selectAll('pieces')
      .data(pie(this.data?.data))
      .join('path')
      .attr('d', d3.arc()
        .innerRadius(71)
        .outerRadius(this.radius)
      )
      .attr('fill', (d: any) => (d.data.color))
      .attr("stroke", "#121926")
      .style("stroke-width", "0rem")
      .on("mouseover", () => {
        console.log('hello')
        d3.select('.chart-tooltip').style("display", "block")
      })
      .on("mouseout", () => {
        d3.select('.chart-tooltip').style("display", "none")
      })
      .on("mousemove", (event:any,d:any) => {
        console.log('kjj',d,event)
        let x = event.pageX;
        let y = event.pageY
        d3.select('.chart-tooltip')
          .style("left", x - 15 + "px")
          .style("top", y - 25 + "px")
          .text(d.data.JobTypeValue);
      });

    // Add labels
    const labelLocation = d3.arc()
      .innerRadius(170)
      .outerRadius(this.radius);

    this.svg
      .selectAll('pieces')
      .data(pie(this.data?.data))
      .enter()
      .append('text')
      .text((d: any) => d.data.review == 0 ? '' : d.data.review)
      .attr("transform", (d: any) => "translate(" + labelLocation.centroid(d) + ")")
      .style("text-anchor", "middle")
      .attr("class", "reviewText")
    // .style("font-size", 0.875+"rem")

    this.svg.append('circle')
      .data(pie(this.data?.data))
      .attr('fill', '#fff')
      .attr('r', '60');

    this.svg.append('text')
      .data(pie(this.data?.data))
      .style('fill', '#000')
      .attr("class", "nominatedText")
      //.style("font-size", "3.5")
      .style("font-weight", "bold")
      .attr("transform", "translate(0," + 10 + ")")
      .attr("text-anchor", "middle")
      .html((d: any) => d.data.nominated);
  }

}
