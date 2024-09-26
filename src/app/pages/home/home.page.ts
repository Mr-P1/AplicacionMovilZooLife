import { Component, OnInit } from '@angular/core';
import { FirestoreService } from '../../common/services/firestore.service';
import { Animal } from '../../common/models/animal.model';
import { Reaction } from 'src/app/common/models/reaction.model';
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
  userId:string = '111';

  like(animalId: string) {
    this.animalsService.getUserReaction(animalId, this.userId).subscribe(existingReaction => {
      if (existingReaction && existingReaction.id) {
        // Si ya existe una reacción y tiene id, actualiza
        this.animalsService.updateReaction(existingReaction.id, { reaction: true }).subscribe(() => {
          console.log('Reacción actualizada a Like');
        });
      } else {
        // Si no existe, crea una nueva reacción
        const reaction: Reaction = {
          animalId: animalId,
          userId: this.userId,
          reaction: true,
          timestamp: new Date()
        };
  
        this.animalsService.addReaction(reaction).subscribe(() => {
          console.log('Reacción guardada como Like');
        });
      }
    });
  }
  
  dontLike(animalId: string) {
    this.animalsService.getUserReaction(animalId, this.userId).subscribe(existingReaction => {
      if (existingReaction && existingReaction.id) {
        // Si ya existe una reacción y tiene id, actualiza
        this.animalsService.updateReaction(existingReaction.id, { reaction: false }).subscribe(() => {
          console.log('Reacción actualizada a D\'Like');
        });
      } else {
        // Si no existe, crea una nueva reacción
        const reaction: Reaction = {
          animalId: animalId,
          userId: this.userId,
          reaction: false,
          timestamp: new Date()
        };
  
        this.animalsService.addReaction(reaction).subscribe(() => {
          console.log('Reacción guardada como D\'Like');
        });
      }
    });
  }

  ngOnInit(): void {
    this.animalsService.getAnimales().subscribe((data: Animal[]) => {
      this.animales = data;
      console.log(this.animales)
    })


    
  }
}
