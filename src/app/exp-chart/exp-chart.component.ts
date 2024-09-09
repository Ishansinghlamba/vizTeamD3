import { ClassGetter } from '@angular/compiler/src/output/output_ast';
import { Component, OnInit } from '@angular/core';
import * as d3 from 'd3';

@Component({
  selector: 'app-exp-chart',
  templateUrl: './exp-chart.component.html',
  styleUrls: ['./exp-chart.component.scss']
})
export class ExpChartComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
    this.exp()
  }

  exp(){
     console.log("hello")
  }
}
