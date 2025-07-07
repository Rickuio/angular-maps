import { AfterViewInit, Component, effect, ElementRef, signal, viewChild } from '@angular/core';
import mapboxgl, {LngLatLike} from 'mapbox-gl';
import { environment } from '../../../enviroments/enviroment';
import { v4 as UuidV4 } from 'uuid'
import { JsonPipe } from '@angular/common';

mapboxgl.accessToken = environment.mapboxKey;

interface Marker {
  id: string;
  mapboxMarker: mapboxgl.Marker;
}

@Component({
  selector: 'app-markers-page',
  imports: [ JsonPipe ],
  templateUrl: './markers-page.component.html',
  styleUrl: './markers-page.component.css',
})
export class MarkersPageComponent implements AfterViewInit { 

  divElement = viewChild<ElementRef>('map');
  map = signal<mapboxgl.Map|null>(null);
  markers = signal<Marker[]>([]);
  
  async ngAfterViewInit() {
  
    if (!this.divElement()?.nativeElement ) return;

    await new Promise((resolve) => setTimeout( () => resolve, 100));
    const element = this.divElement()!.nativeElement;

    const map = new mapboxgl.Map({
      container: element,
      style: 'mapbox://styles/mapbox/streets-v12',
      center: [-122.409850, 37.793085],
      zoom: 14
    });

    const marker = new mapboxgl.Marker({
      draggable: false,
      color: '#fafafa'
    })
      .setLngLat([-122.409850, 37.793085])
      .addTo(map)
    
    marker.on('dragend', () => {
      const lngLat = marker.getLngLat();
      console.log('Marker dragged to:', lngLat);
    });

    this.mapListeners(map);
    
  }

  mapListeners( map: mapboxgl.Map) {
    map.on('click', (event) => this.mapClick(event));
    this.map.set(map);
  }

  mapClick(event: mapboxgl.MapMouseEvent) {
    if (!this.map()) return;
    const map = this.map()!;
    const coords = event.lngLat;
    const colorRamdom = '#xxxxxx'.replace(/x/g, (y) => 
    ((Math.random()*16) | 0).toString(16)
    );
    // console.log(event.lngLat);
    const mapboxMarker = new mapboxgl.Marker({
      color: colorRamdom
    })
    .setLngLat(coords)
    .addTo(map);

    const newMarker: Marker = {
      id: UuidV4(),
      mapboxMarker: mapboxMarker
    }
    
    // this.markers.set([newMarker, ...this.markers()]);
    this.markers.update((markers) => [newMarker, ...markers]);
    
  }

  flyToMarker ( lngLat: LngLatLike ) {
    if (!this.map()) return;
    this.map()?.flyTo({
      center: lngLat,
    });
  }

  deleteMarker(marker: Marker) {
    if (!this.map()) return;
    const map = this.map()!;
    marker.mapboxMarker.remove();
    this.markers.set(this.markers().filter(m => m.id !== marker.id));
  }

}
