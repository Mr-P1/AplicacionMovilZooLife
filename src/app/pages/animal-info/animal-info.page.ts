import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonCard, IonCardHeader, IonCardTitle, IonCardSubtitle, IonCardContent, IonLoading, IonRow, IonCol, IonModal, IonButton, IonButtons, IonIcon, IonGrid } from '@ionic/angular/standalone';
import { FirestoreService } from '../../common/services/firestore.service';
import { Animal } from '../../common/models/animal.model';
import { Observable } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from '../../common/services/auth.service';

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
    private route: ActivatedRoute,
    private authService: AuthService,
  ) { }

  setCuriosidadOpen(isOpen: boolean) {
    this.isCuriosidadModalOpen = isOpen;
  }

  setPrecaucionOpen(isOpen: boolean) {
    this.isPrecaucionModalOpen = isOpen;
  }

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    const userId = this.authService.currentUserId;

    if (id) {
      this.animal$ = this.animalService.getAnimal(id);

      if (userId) {
        // Verificar si el usuario ya vio el animal antes de guardar
        this.animalService.usuarioHaVistoAnimal(userId, id).subscribe(haVisto => {
          if (!haVisto) {
            // Si no lo ha visto, iniciar un temporizador de 5 segundos
            setTimeout(() => {
              this.animalService.guardarAnimalVisto(userId, id).subscribe({
                next: () => console.log('Animal visto guardado exitosamente'),
                error: (error) => console.error('Error al guardar el animal visto', error)
              });
            }, 5000); // Esperar 5 segundos
          }
        });
      }
    }
  }




}
