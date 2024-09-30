import { Component, OnInit, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonImg } from '@ionic/angular/standalone';
import { StorageService } from './../../common/services/storage.service';
import PinchZoom from 'pinch-zoom-js';

@Component({
  selector: 'app-mapa',
  templateUrl: './mapa.page.html',
  styleUrls: ['./mapa.page.scss'],
  standalone: true,
  imports: [IonImg, IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule]
})
export class MapaPage implements OnInit, AfterViewInit {

  imageUrl: string | undefined;

  constructor(private storageService: StorageService) { }

  ngOnInit(): void {
    const imagePath = 'gs://appzoolife.appspot.com/mapas/MAPA-BZ_2024.jpg';  

    this.storageService.getImageUrl(imagePath).then((url) => {
      this.imageUrl = url;  
    }).catch((error) => {
      console.error('Error getting image URL:', error);
    });
  }

  ngAfterViewInit(): void {
    const zoomContainer = document.getElementById('zoom-container');
    if (zoomContainer) {
      const pinchZoom = new PinchZoom(zoomContainer, {
        tapZoomFactor: 2,
        zoomOutFactor: 1.3,
        animationDuration: 300,
        draggableUnzoomed: false,
        setOffsetsOnce: true,
        use2d: true
      });
    }
  }
}
