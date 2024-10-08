
import { Component, OnInit} from '@angular/core';
import { FirestoreService } from '../../common/services/firestore.service';
import { Animal } from '../../common/models/animal.model';
import { Reaction } from 'src/app/common/models/reaction.model';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { IonicModule} from '@ionic/angular';
import { AuthService } from './../../common/services/auth.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: true,
  imports: [CommonModule, RouterLink,IonicModule]
})
export class HomePage implements OnInit {
  animales: Animal[] = [];
  userId:string = '';
  filteredAnimals: Animal[] = []; // Lista de animales filtrados
  searchTerm: string = ''; // Para almacenar el término de búsqueda
 
  constructor(
    private animalsService: FirestoreService,
    private authService: AuthService,
    private router: Router
    
  ) {}
  
  ngOnInit(): void {

    this.animalsService.getAnimales().subscribe((data: Animal[]) => {
      this.animales = data;
    })

    this.authService.authState$.subscribe(user => {
      if (user) {
        this.userId = user.uid;
        // Cargar los animales y luego las reacciones del usuario
        this.loadAnimalsWithReactions();
      }
    });

  }

  loadAnimalsWithReactions() {
    this.animalsService.getAnimales().subscribe((animales: Animal[]) => {
      this.animales = animales;

      // Para cada animal, buscamos la reacción del usuario
      this.animales.forEach(animal => {
        this.animalsService.getUserReaction(animal.id, this.userId).subscribe(reaction => {
          animal.reaccion = reaction ? reaction.reaction : null; // true = like, false = don't like, null = sin reacción
        });
      });
    });
  }

  // Método para filtrar animales según el término de búsqueda
  filterAnimals(event: any) {
    this.searchTerm = event.target.value.toLowerCase();
    if (this.searchTerm && this.searchTerm.trim() !== '') {
      this.filteredAnimals = this.animales.filter(animal =>
        animal.nombre_comun.toLowerCase().includes(this.searchTerm)
      );
    } else {
      this.filteredAnimals = [];
    }
  }

  // Método para redirigir a la página de información del animal
  goToAnimal(animalId: string) {
    this.router.navigate(['/app/animal-info', animalId]);
    this.searchTerm = '';
    this.filteredAnimals = [];
  }

  like(animalId: string) {
    const animal = this.animales.find(a => a.id === animalId);
    if (animal) {
      // Actualiza el estado de la UI inmediatamente
      animal.reaccion = true;

      // Luego realiza la operación en Firestore
      this.animalsService.getUserReaction(animalId, this.userId).subscribe(existingReaction => {
        if (existingReaction && existingReaction.id) {
          // Actualiza la reacción en Firestore
          this.animalsService.updateReaction(existingReaction.id, { reaction: true }).subscribe(() => {
            console.log('Reacción actualizada a Like');
          });
        } else {
          // Crea una nueva reacción en Firestore
          const reaction: Reaction = {
            animalId: animalId,
            userId: this.userId,
            reaction: true
          };

          this.animalsService.addReaction(reaction).subscribe(() => {
            console.log('Reacción guardada como Like');
          });
        }
      });
    }
  }

  dontLike(animalId: string) {
    const animal = this.animales.find(a => a.id === animalId);
    if (animal) {
      // Actualiza el estado de la UI inmediatamente
      animal.reaccion = false;

      // Luego realiza la operación en Firestore
      this.animalsService.getUserReaction(animalId, this.userId).subscribe(existingReaction => {
        if (existingReaction && existingReaction.id) {
          // Actualiza la reacción en Firestore
          this.animalsService.updateReaction(existingReaction.id, { reaction: false }).subscribe(() => {
            console.log('Reacción actualizada a No me gusta');
          });
        } else {
          // Crea una nueva reacción en Firestore
          const reaction: Reaction = {
            animalId: animalId,
            userId: this.userId,
            reaction: false
          };

          this.animalsService.addReaction(reaction).subscribe(() => {
            console.log('Reacción guardada como No me gusta');
          });
        }
      });
    }
  }


}
