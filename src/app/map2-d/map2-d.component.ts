import { Component, OnInit } from '@angular/core';
import * as d3 from 'd3';
import  myworlddata from '../Data/world.json';



@Component({
  selector: 'app-map2-d',
  templateUrl: './map2-d.component.html',
  styleUrls: ['./map2-d.component.scss']
})
export class Map2DComponent implements OnInit {
  myworlddata2:any = myworlddata.features


  constructor() { }

  ngOnInit(): void {
   this.makeMap()
  }

  makeMap(){
   let data= this.myworlddata2
    //dimensions
    let width = 1000
    let height = 450;
  

    //projection
    let projection = d3.geoNaturalEarth1()
    .scale(150)
    .center([0, 0])
    .rotate([0,0])
    .translate([width / 2, height / 2])

    //setting
    let svg = d3.select("#map")
    .append("svg")
    .attr("width", '100%')
    .attr("height", '20%') 
    .attr('viewBox', `0 0 ${width} ${height}`)

    let map = svg.append("g")

   let path = d3.geoPath().projection(projection)

    map.append("g")
    .attr("class", "countries" )
    .selectAll("path")
    .data(data)
    .enter().append("path")
    .attr("class", (d:any) => "country_" + d.properties.name.replace(" ","_"))
    .attr("d", path)
    .attr("fill",  function(d:any) {
      let color = d.continent == 'americas' ? '#F6C125' : d.continent == 'middle east' ? '#F48945': d.continent == 'africa' ? '#7FC546' : d.continent == 'indo-pacific' ? '#CD4545': d.continent == 'europe' ? '#710C0C':'white'
     
     return color
   })
    .style('stroke', 'black')
    .style('stroke-width', 0.3)
    .style("opacity",0.8)

  }

}
