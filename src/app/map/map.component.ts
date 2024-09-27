import { Component, OnInit ,ElementRef,ViewChild} from '@angular/core';
import * as d3 from 'd3';
import  myworlddata from '../Data/world.json';
import {MatDialog} from '@angular/material/dialog';
import { ModalMapComponent } from '../modal-map/modal-map.component';
import {ThemePalette} from '@angular/material/core';


@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss']
})
export class MapComponent implements OnInit {
  color: ThemePalette = 'accent';
  checked = false;
  disabled = false;
  @ViewChild('map', { static: false }) mapElement!: ElementRef;

  ngAfterViewInit(): void {
    // Safe to manipulate the DOM or use D3
    const mapWidth = this.getMapWidth();
    console.log('Map width:', mapWidth);
  }
  myworlddata2:any = myworlddata.features
data:any={
  "type": "FeatureCollection",
  "features": [
    {
      "type": "Feature",
      "properties": {
        "name": "Africa"
      },
      "geometry": {
        "type": "Polygon",
        "coordinates": [[[-6, 36], [33, 30], [43, 11], [51, 12], [29, -33], [18, -35], [7, 5], [-17, 14], [-6, 36]]]
      }
    },
    {
      "type": "Feature",
      "properties": {
        "name": "Australia"
      },
      "geometry": {
        "type": "Polygon",
        "coordinates": [[[143, -11], [153, -28], [144, -38], [131, -31], [116, -35], [114, -22], [136, -12], [140, -17], [143, -11]]]
      }
    },
    {
      "type": "Feature",
      "properties": {
        "name": "Timbuktu"
      },
      "geometry": {
        "type": "Point",
        "coordinates": [-3.0026, 16.7666]
      }
    }
  ]
};
  constructor(public dialog: MatDialog) { }

  ngOnInit(): void {
    // this.drawMap();
    this.myworlddata2 = this.myworlddata2.map(obj => {
      return {
        ...obj,           // Copy all existing properties
        clicked: false    // Add the 'clicked' property with an initial value of 'false'
      };
    });
    this.tryexp(this.myworlddata2,false)
  }

  buttonClick(){
    console.log(this.checked)
  }
 
  onToggleChange(event: any) {
   
    this.checked = event.checked
    this.tryexp(this.myworlddata2,this.checked)
  }

  drawMap(){
    let projection = d3.geoEquirectangular()
    .scale(200)
    .translate([200, 150]);

    let geoGenerator = d3.geoPath()
  .projection(projection);

  let u = d3.select('#content g.map')
  .selectAll('path')
  .data(this.data.features);

u.enter()
  .append('path')
  .attr('d', geoGenerator);
  }

  tryexp(data:any,globe_s:boolean){
  let svg_i = d3.select("svg");

if (!svg_i.empty()) {
  svg_i.remove(); // Remove the SVG if it exists
}
    
    let width = this.getMapWidth()
    let height = 500
    const sensitivity = 75;
    let projection;
    if(globe_s){
      projection =d3.geoOrthographic ()
      .scale(250)
      .center([0, 0])
      .rotate([0,-30])
      .translate([width / 2, height / 2]);
    } else{
      projection =d3.geoMercator()
      .scale(250)
      .center([0, 0])
      .rotate([0,-30])
      .translate([width / 2, height / 2]);
      
    }

    const initialScale = projection.scale()
  let path:any = d3.geoPath().projection(projection)

  let svg = d3.select("#map")
    .append("svg")
    .attr("width", width)
    .attr("height", height)

 if(globe_s){

   var globe = svg.append("circle")
     .attr("fill", "#EEE")
     .attr("stroke", "#000")
     .attr("stroke-width", "0.2")
     .attr("cx", width/2)
     .attr("cy", height/2)
     .attr("r", initialScale);
 }


    svg.call(d3.drag().on('drag', (event) => {
    const rotate = projection.rotate()
    const k = sensitivity / projection.scale()
    projection.rotate([
      rotate[0] + event.dx * k,
      rotate[1] - event.dy * k
    ])
    path = d3.geoPath().projection(projection)
    svg.selectAll("path").attr("d", path)
  }))
    .call(d3.zoom().on('zoom', (event) => {
      if(event.transform.k > 0.3) {
        projection.scale(initialScale * event.transform.k)
        path = d3.geoPath().projection(projection)
        svg.selectAll("path").attr("d", path);
        
        if(globe_s){

          globe.attr("r", projection.scale())
        }
      }
      else {
        event.transform.k = 0.3
      }
    }))

  let map = svg.append("g")

  map.append("g")
  .attr("class", "countries")
  .selectAll("path")
  .data(data)
  .join("path")
  .attr("class", (d:any) => "country_" + d.properties.name.replace(/\s+/g, "_"))
  .attr("d", path)
  .attr("fill",  function(d:any) {
     let color = d.continent == 'americas' ? 'orange' : d.continent == 'middle east' ? 'black': d.continent == 'africa' ? 'red' : d.continent == 'indo-pacific' ? 'blue': d.continent == 'europe' ? 'green':'white'
    
    return color
  })
  .attr("stroke", "black")
  .attr("stroke-width", '0')
  .attr("opacity", 0.8).on("click", (event, d:any) =>{
    // Example: Log the clicked country’s name
  
    this.myworlddata2 = data.map(obj => {
      if (obj.id === d.id) {
        return { ...obj, clicked: obj.clicked ? false : true };
      } else {
        return obj;
      }
    });

    this.tryexp(this.myworlddata2,this.checked);
    const dialogRef = this.dialog.open(ModalMapComponent, {
      width: '550px',
      data: { "title":d.properties.name}
    });
})
  }
  getMapWidth(): number {
    // Using D3 to select the element and get its width
    const mapElement = d3.select("#map").node() as HTMLElement;
    return mapElement.getBoundingClientRect().width;
  }

  
}
