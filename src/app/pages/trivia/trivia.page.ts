import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { PreguntaTrivia } from 'src/app/common/models/trivia.models';
import { FirestoreService } from 'src/app/common/services/firestore.service';
import { AuthService } from './../../common/services/auth.service';

@Component({
  selector: 'app-trivia',
  templateUrl: './trivia.page.html',
  styleUrls: ['./trivia.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class TriviaPage implements OnInit {
  preguntas: PreguntaTrivia[] = [];
  userId: string = '';

  constructor(
    private preguntaService: FirestoreService,
    private authService: AuthService
  ) { }

  seleccionarRespuesta(pregunta: PreguntaTrivia, respuesta: string) {
    const esCorrecta = respuesta === pregunta.respuesta_correcta;

    if (esCorrecta) {
      console.log('¡Respuesta correcta!');
    } else {
      console.log('Respuesta incorrecta');
    }
  }

  ngOnInit() {
    // Nos suscribimos al estado de autenticación
    this.authService.authState$.subscribe(user => {
      if (user) {
        this.userId = user.uid;
        console.log('User ID:', this.userId);

        // Solo después de obtener el userId hacemos la consulta de las preguntas
        this.preguntaService.getPreguntasTriviaPorAnimalesVistos(this.userId).subscribe((data: PreguntaTrivia[]) => {
          this.preguntas = data;
        });
      } else {
        console.log('No hay usuario autenticado');
      }
    });
  }
}
