import { AfterViewInit, Component, ElementRef, input, signal, viewChild } from '@angular/core';
import mapboxgl from 'mapbox-gl';
import { environment } from '../../../../enviroments/enviroment';

mapboxgl.accessToken = environment.mapboxKey;

@Component({
  selector: 'app-mini-map',
  imports: [],
  templateUrl: './mini-map.component.html',
  styles: `
    div {
      width: 100%;
      height: 260px;
    }
  `
})
export class MiniMapComponent implements AfterViewInit {

  divElement = viewChild<ElementRef>('map');
  lngLat = input.required<{lng: number, lat: number}>();
  zoom = input<number>(13);

    async ngAfterViewInit() {

    if (!this.divElement()?.nativeElement ) return;

    await new Promise((resolve) => setTimeout( () => resolve, 100));

    const element = this.divElement()!.nativeElement;

    const map = new mapboxgl.Map({
      container: element,
      style: 'mapbox://styles/mapbox/streets-v12',
      center: this.lngLat(),
      zoom: this.zoom(),
      interactive: false,
      pitch: 30
    });

    new mapboxgl.Marker().setLngLat(this.lngLat()).addTo(map);
    
  }

}
