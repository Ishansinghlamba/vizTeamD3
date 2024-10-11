import { Component, OnInit } from '@angular/core';
import * as d3 from 'd3';
import  myworlddata from '../Data/world.json';
import * as topojson from "topojson-client";



@Component({
  selector: 'app-map2-d',
  templateUrl: './map2-d.component.html',
  styleUrls: ['./map2-d.component.scss']
})
export class Map2DComponent implements OnInit {
  myworlddata2:any = myworlddata.features


  constructor() { }

  ngOnInit(): void {
    // d3.json('https://raw.githubusercontent.com/neocarto/resources/master/geometries/World/world_countries.topojson')
    //   .then((data) => {
    //     this.createMap(data); // Call a method to render the map using D3
    //   })
    //   .catch((error) => {
    //     console.error('Error loading the world.json file:', error);
    //   });
   this.makeMap()
  }

  makeMap(){
  
   let data= this.myworlddata2

    //dimensions
    let width = 1000
    let height = 450;

    const continents = d3.groups(data, (d: any) => d.continent);
    console.log(continents)

    //projection
    var projection = d3.geoNaturalEarth1()
    .scale(150)
    .center([0, 0])
    .rotate([0,0])
    .translate([width / 2, height / 2])

    //setting
    var svg = d3.select("#map")
    .append("svg")
    .attr("width", '100%')
    .attr("height", '20%') 
    .attr('viewBox', `0 0 ${width} ${height}`)

    var map = svg.append("g")

   var path = d3.geoPath().projection(projection)

   

      continents.forEach(([continent, countries]) => {
      console.log(continent)
      console.log(countries)
      // Create a group for each continent
      const continentGroup = svg.append('g')
        .attr('class', continent);

        // console.log(continentGroup)
      // // Adjust the translation based on the continent
      let translation = [0, 0]; // Default translation
      if (continent === 'africa') {
        translation = [-6, 2];  // Shift down
      } else if (continent === 'indo-pacific') {
        translation = [0, 2];  // Shift right
      } else if (continent === 'europe') {
        translation = [0, 0];  // Shift up
      } else if (continent === 'middle east') {
        translation = [-3, 4];  // Shift northwest
      } else if (continent === 'americas') {
        translation = [0, 0];  // Shift southwest
      }

      // // Apply translation to the group of countries in the continent
      continentGroup.attr('transform', `translate(${translation[0]}, ${translation[1]})`);

      // Draw the countries for this continent
      continentGroup.selectAll('path')
        .data(countries)
        .enter().append('path')
        .attr('d', path)
        .attr("fill",  function(d:any) {
          let color = d.continent == 'americas' ? '#F6C125' : d.continent == 'middle east' ? '#F48945': d.continent == 'africa' ? '#7FC546' : d.continent == 'indo-pacific' ? '#CD4545': d.continent == 'europe' ? '#710C0C':'white';
          return color
        })
        .attr('stroke', 'black')  // Borders for individual countries
        .attr('stroke-width', 0);
    });
  

    

  //   map.append("g")
  //   .attr("class", "countries" )
  //   .selectAll("path")
  //   .data(data)
  //   .enter().append("path")
  //   .attr("class", (d:any) => "country_" + d.properties.name.replace(" ","_"))
  //   .attr("d", path)
  //   .attr("fill",  function(d:any) {
  //     let color = d.continent == 'americas' ? '#F6C125' : d.continent == 'middle east' ? '#F48945': d.continent == 'africa' ? '#7FC546' : d.continent == 'indo-pacific' ? '#CD4545': d.continent == 'europe' ? '#710C0C':'white'
     
  //    return color
  //  })
  //  .attr('stroke', (d:any) => {
  //   // Return stroke color based on continent
  //   switch (d.continent) {
  //       case 'africa': return 'red';
  //       case 'asia': return 'red';
  //       case 'europe': return 'blue';
  //       case 'north america': return 'orange';
  //       case 'south america': return 'yellow';
  //       case 'australia': return 'purple';
  //       case 'antarctica': return 'lightblue';
  //       default: return 'black'; // Default for undefined
  //   }})
  //   .style('stroke-width', 0.3)
  //   .style("opacity",0.8)

  }

  // createMap(data:any){
  //   console.log(data)
  //   let height = 450;
  //   let width=1000
  //    let countries = topojson.feature(data, data.objects.world_countries_data);
  //    const outerBoundaries = topojson.mesh(data, data.objects.world_countries_data, (a, b) => a !== b);
  //    let merged = topojson.merge(data, data.objects.world_countries_data.geometries)

  //   let projection = d3.geoNaturalEarth1()
  //   .scale(155)
  //   .center([10, 10])
  //   .rotate([0,0])
  //   .translate([width / 2, height / 2]);
  //   let path = d3.geoPath(projection)
  //   let svg = d3.select("#map")
  //   .append("svg")
  //   .attr("width", '100%')
  //   .attr("height", '100%') 
  //   .attr('viewBox', `0 0 ${width} ${height}`)

  //   svg
  //   .append("path")
  //   .datum(countries)
  //   .attr("fill", "#ed87c8")
  //   .attr("stroke", "white")
  //   .attr("stroke-width", 0.4)
  //   .attr("d", path);
    
  // }

}
