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
  zoom: number = 0;

  constructor() { }

  ngOnInit(): void {
    this.makeMap()
  }

  makeMap() {

    const existingSvg = d3.select("svg");
    if (!existingSvg.empty()) {   
      existingSvg.remove();  // Remove it if it exists 
      }
       

    let data = this.myworlddata2
    //dimensions
    let width = 1000
    let height = 450;
    let projection_continents = [{ currentCoord: [22, 1], continent: "africa", targetCoord: [-79, 6] }, { currentCoord: [-81, 9], continent: "americas", targetCoord: [-72, 12] }, { currentCoord: [91, 38], continent: "indo-pacific", targetCoord: [-79, 6] }, { currentCoord: [96, 63], continent: "europe", targetCoord: [-79, 6] }, { currentCoord: [47, 33], continent: "middle east", targetCoord: [-79, 6] }]

    const continents = d3.groups(data, (d: any) => d.continent);

    //projection
    let projection = d3.geoNaturalEarth1()
      .scale(180)
      .center([10, 10])
      .rotate([0, 0])
      .translate([width / 2, height / 2])

    //setting
    let svg = d3.select("#map")
    .on('click', () => {
        console.log('zoom from svg', this.zoom)
        if (this.zoom == 1) {
          console.log('hello from inside')
          this.makeMap()
        }
      })
      .append("svg")
      .attr("width", '100%')
      .attr("height", '20%')
      .attr('viewBox', `0 0 ${width} ${height}`)


    let path = d3.geoPath().projection(projection)
    // d3.select('body').append('div').attr('id', 'tooltip').attr('style', 'position: absolute; opacity: 0;');
    continents.forEach(([continent, countries]) => {
      // Create a group for each continent
      const continentGroup = svg.append('g')
        .attr('class', `${continent} vk`)
        .on('click', (event: any) => {
          console.log(continent)
          const selectedContinent = projection_continents.find(region => region.continent === continent);

          const [targetLongitude, targetLatitude] = selectedContinent.targetCoord;
          const [currentLongitude, currentLatitude] = selectedContinent.currentCoord;


          const targetCoords = projection([targetLongitude, targetLatitude]);
          const currentCoords = projection([currentLongitude, currentLatitude])
          const dx = (targetCoords[0] - currentCoords[0]) * 1.5;
          const dy = (targetCoords[1] - currentCoords[1]) * 1.5;

          d3.select('svg').transition().duration(750)
            .attr('transform', `translate(${dx},${dy}) scale(1.5)`);
          console.log('zooom g', this.zoom);
          event.stopPropagation()
          this.zoom = 1;
        })
        .on('mouseover', function (d) {
        }).on('mousemove', function (event: any, d: any) {
          d3.select('#tooltip').style('opacity', 1).style('left', (event.pageX + 10) + 'px').style('top', (event.pageY + 10) + 'px').text(continent)
          d3.select(this).style("opacity", 0.8);
          d3.select(this).style("cursor", "pointer");

        })
        .on('mouseout', function () {
          d3.select('#tooltip').style('opacity', 0)
          d3.select(this).style("opacity", 1);
          d3.select(this).style("cursor", "default");
        })




      // Draw the countries for this continent
      continentGroup.selectAll('path')
        .data(countries)
        .enter().append('path')
        .attr('class', 'continent')
        .attr('d', path)
        .attr("fill", function (d: any) {
          let color = d.continent == 'americas' ? '#F6C125' : d.continent == 'middle east' ? '#F48945' : d.continent == 'africa' ? '#7FC546' : d.continent == 'indo-pacific' ? '#CD4545' : d.continent == 'europe' ? '#710C0C' : 'none';
          return color
        })
        .attr("stroke-width", function (d: any) {
          console.log(d)
          let width = (d.continent == 'border' ? 1 : 0);
          return width
        })
        .style("stroke", "white")

    });


    const countries = [{ coord: [101, 61], continent: "Europe", models: 10, anomalies: 70 }, { coord: [-100, 40], continent: "Americas", models: 10, anomalies: 70 }, { coord: [98, 32], continent: "Indo-Pacific", models: 0, anomalies: 70 }, { coord: [45, 27], continent: "Middle East", models: 10, anomalies: 70 },{ coord: [-39, 2], continent: "Global", models: 0, anomalies: 70 }];
    const countriuesFilteredData = countries.filter(obj => obj.models !== 0);
    const width_rect = 70;
    const height_rect = 45;

    countriuesFilteredData.forEach(countryName => {
      const [lon, lat] = countryName.coord;
      const screenCoords = projection([lon, lat]);
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
        .attr("class", "label boxTitle")
        .attr("x", x) // Middle of the rectangle
        .attr("y", y - (height_rect / 2) + 10)
        .attr("dy", ".35em") // Adjust the vertical alignment of the text
        .text(countryName.continent)


      svg.append("text")
        .attr("class", "label")
        .attr("x", x)
        .attr("y", y - (height_rect / 2) + 25)
        .attr("dy", ".35em")
        .text(`Models : ${countryName.models}`)

      svg.append("text")
        .attr("class", "label")
        .attr("x", x)
        .attr("y", y - (height_rect / 2) + 35)
        .attr("dy", ".35em")
        .text(`Anomalies : ${countryName.anomalies}`)

    });



    //coordinates for space and global
    //Append them only if models value is greater than 0 for satellite and globe.
    const coordAll = [{ coord: [-40, 20], img: "assets/svg/Globe.svg" },{ coord: [-140, -41], img: "assets/svg/Satellite.svg" }]
    const imageWidth = 80;
    const imageHeight = 60;
    coordAll.forEach(data_all => {

      const [lon, lat] = data_all.coord;
      const screenCoords = projection([lon, lat]);
      const x = screenCoords[0];
      const y = screenCoords[1];



      svg.append("image")
        .attr("xlink:href", data_all.img)
        .attr("x", x - (imageWidth / 2))  // Center the image horizontally
        .attr("y", y - (imageHeight / 2))
        .attr("width", imageWidth)
        .attr("height", imageHeight);

    })

  }





}
