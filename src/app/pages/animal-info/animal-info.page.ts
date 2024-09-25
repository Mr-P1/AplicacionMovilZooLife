import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonCard, IonCardHeader, IonCardTitle, IonCardSubtitle, IonCardContent, IonLoading, IonRow, IonCol, IonModal, IonButton, IonButtons, IonIcon, IonGrid } from '@ionic/angular/standalone';
import { FirestoreService } from '../../common/services/firestore.service';
import { Animal } from '../../common/models/animal.model';
import { Observable } from 'rxjs';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-animal-info',
  templateUrl: './animal-info.page.html',
  styleUrls: ['./animal-info.page.scss'],
  standalone: true,
  imports: [IonGrid, IonIcon, IonButtons, IonButton, IonModal, IonCol, IonRow, IonLoading, IonCardContent, IonCardSubtitle, IonCardTitle, IonCardHeader, IonCard, IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, IonContent]
})
export class AnimalInfoPage implements OnInit {
  isCuriosidadModalOpen = false;
  isPrecaucionModalOpen = false;
  animal$: Observable<Animal | null> | undefined;
  constructor(
    private animalService: FirestoreService,
    private route: ActivatedRoute
  ) { }

  setCuriosidadOpen(isOpen: boolean) {
    this.isCuriosidadModalOpen = isOpen;
  }

  setPrecaucionOpen(isOpen: boolean) {
    this.isPrecaucionModalOpen = isOpen;
  }
  
  ngOnInit() {
    // Obtener el ID desde la URL
    const id = this.route.snapshot.paramMap.get('id');
    
    if (id) {
      // Llamar al servicio y suscribirse al observable
      this.animal$ = this.animalService.getAnimal(id);
    }

 
    

  }
}
