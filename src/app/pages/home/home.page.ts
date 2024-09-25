import { Component, OnInit } from '@angular/core';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonItem, IonList, IonLabel, IonCard, IonCardHeader, IonCardContent, IonCardTitle, IonCardSubtitle, IonButton } from '@ionic/angular/standalone';
import { FirestoreService } from '../../common/services/firestore.service';
import { Animal } from '../../common/models/animal.model';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { IonicModule} from '@ionic/angular';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: true,
  imports: [CommonModule, RouterLink,IonicModule],
})
export class HomePage implements OnInit {
  animales: Animal[] = [];
  constructor(private animalsService: FirestoreService) {}
  ngOnInit(): void {
    this.animalsService.getAnimales().subscribe((data: Animal[]) => {
      this.animales = data;
      console.log(this.animales)
    })
  }
}
