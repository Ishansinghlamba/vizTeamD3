import { Component, OnInit } from '@angular/core';
import * as d3 from 'd3';
import myworlddata from '../Data/world.json';



@Component({
  selector: 'app-map2-d',
  templateUrl: './map2-d.component.html',
  styleUrls: ['./map2-d.component.scss']
})
export class Map2DComponent implements OnInit {
  myworlddata2: any = myworlddata.features


  constructor() { }

  ngOnInit(): void {
    this.makeMap()
  }

  makeMap() {
    let data = this.myworlddata2
    //dimensions
    let width = 1000
    let height = 450;

    const continents = d3.groups(data, (d: any) => d.continent);
    console.log('con', continents)

    //projection
    let projection = d3.geoNaturalEarth1()
      .scale(180)
      .center([10, 10])
      .rotate([0, 0])
      .translate([width / 2, height / 2])

    //setting
    var svg = d3.select("#map")
      .append("svg")
      .attr("width", '100%')
      .attr("height", '20%')
      .attr('viewBox', `0 0 ${width} ${height}`)

    let map = svg.append("g")

    var path = d3.geoPath().projection(projection)
    d3.select('body').append('div').attr('id', 'tooltip').attr('style', 'position: absolute; opacity: 0;');
    continents.forEach(([continent, countries]) => {
      // Create a group for each continent
      const continentGroup = svg.append('g')
        .attr('class', `${continent} vk`)
        .on('mouseover', function (d) {
        }).on('mousemove', function (event: any, d: any) {
          d3.select('#tooltip').style('opacity', 1).style('left', (event.pageX + 10) + 'px').style('top', (event.pageY + 10) + 'px').text(continent)
          d3.select(this).style("opacity", 0.8);

        })
        .on('mouseout', function () {
          d3.select('#tooltip').style('opacity', 0)
          d3.select(this).style("opacity", 1);
        })

      // Adjust the translation based on the continent
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
        .attr('class', 'continent')
        .attr('d', path)
        .attr("fill", function (d: any) {
          let color = d.continent == 'americas' ? '#F6C125' : d.continent == 'middle east' ? '#F48945' : d.continent == 'africa' ? '#7FC546' : d.continent == 'indo-pacific' ? '#CD4545' : d.continent == 'europe' ? '#710C0C' : 'white';
          return color
        })
        .attr('stroke', 'black')  // Borders for individual countries
        .attr('stroke-width', 0)
    });


    const countries = [{ coord: [101,61], continent: "Europe", models: 10, anomalies: 70 }, { coord: [-100,37], continent: "Americas", models: 10, anomalies: 70 }, { coord: [98,32], continent: "Indo-Pacific", models: 10, anomalies: 70 }, { coord: [41,32], continent: "Middle east", models: 10, anomalies: 70 }];
    const width_rect = 90;
    const height_rect = 50;

    countries.forEach(countryName => {
       //[longitude,lattitude]
      // Get the screen coordinates
      const [lon, lat] = countryName.coord;
      const screenCoords = projection([lon, lat] );
      const x = screenCoords[0];
      const y = screenCoords[1];

        // Append a rectangle at the centroid of the country
        svg.append("rect")
          .attr("class", "highlight")
          .attr("x", x - (width_rect / 2))
          .attr("y", y - (height_rect / 2))
          .attr("width", width_rect)
          .attr("height", height_rect)
          .attr("rx", 5)  // Rounded corner radius for x
          .attr("ry", 5)  // Rounded corner radius for y
          .attr("fill", "steelblue");  // Add color or style as desired

        svg.append("text")
          .attr("class", "label")
          .attr("x", x) // Middle of the rectangle
          .attr("y", y - (height_rect / 2) + 10)
          .attr("dy", ".35em") // Adjust the vertical alignment of the text
          .text(countryName.continent)


        svg.append("text")
          .attr("class", "label")
          .attr("x", x)
          .attr("y", y - (height_rect / 2) + 30)
          .attr("dy", ".35em")
          .text(`Models : ${countryName.models}`)

        svg.append("text")
          .attr("class", "label")
          .attr("x", x)
          .attr("y", y - (height_rect / 2) + 40)
          .attr("dy", ".35em")
          .text(`Anomalies : ${countryName.anomalies}`)
      
    });


    //Global image coordinates
    const globalCoordinates: [number, number] = [-40, 20]; //[longitude,lattitude]
    // Get the screen coordinates
    const screenCoords = projection(globalCoordinates);
    const x = screenCoords[0];
    const y = screenCoords[1];
    const imageWidth = 80;
    const imageHeight = 80;

    svg.append("image")
      .attr("xlink:href", "https://upload.wikimedia.org/wikipedia/commons/0/09/America_Online_logo.svg")  // Path to your SVG image
      .attr("x", x - (imageWidth / 2))  // Center the image horizontally
      .attr("y", y - (imageHeight / 2))  // Center the image vertically
      .attr("width", imageWidth)         // Set the width of the image
      .attr("height", imageHeight);

  }


}
