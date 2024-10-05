import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { PreguntaTrivia } from 'src/app/common/models/trivia.models';
import { FirestoreService } from 'src/app/common/services/firestore.service';
import { AuthService } from './../../common/services/auth.service';
import { Usuario } from 'src/app/common/models/usuario.model';

@Component({
  selector: 'app-trivia',
  templateUrl: './trivia.page.html',
  styleUrls: ['./trivia.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class TriviaPage implements OnInit {
  preguntas: PreguntaTrivia[] = [];
  preguntasRandom: PreguntaTrivia[] = [];
  userId: string = '';
  usuario: Usuario | null = null;
  respuestasCorrectas: number = 0; // Nueva variable para contar las respuestas correctas

  constructor(
    private preguntaService: FirestoreService,
    private authService: AuthService
  ) { }

  seleccionarRespuesta(pregunta: PreguntaTrivia, respuesta: string) {
    // Verificamos si la pregunta ya fue respondida
    if (pregunta.respondida) {
      return;  // Si ya fue respondida, no permitimos seleccionar otra respuesta
    }

    pregunta.respondida = true;  // Marcamos la pregunta como respondida
    pregunta.respuestaCorrecta = (respuesta === pregunta.respuesta_correcta);  // Verificamos si la respuesta fue correcta

    if (pregunta.respuestaCorrecta) {
      console.log('¡Respuesta correcta!');
      this.respuestasCorrectas++;  // Incrementamos las respuestas correctas
    } else {
      console.log('Respuesta incorrecta');
    }
    console.log(this.respuestasCorrectas)
  }

  ngOnInit() {
    // Nos suscribimos al estado de autenticación
    this.authService.authState$.subscribe(user => {
      if (user) {
        this.userId = user.uid;
        console.log('User ID obtenido:', this.userId);

        // Solo hacemos las peticiones a Firestore si obtenemos el userId
        if (this.userId) {
          // Ajustamos la llamada a getUsuario para buscar por el campo auth_id
          this.preguntaService.getUsuarioID(this.userId).subscribe((data: Usuario | null) => {
            if (data) {
              this.usuario = data;
              console.log('Usuario obtenido:', this.usuario);

              // Después de obtener el usuario, cargamos las preguntas
              this.preguntaService.getPreguntasTriviaPorAnimalesVistos(this.userId).subscribe((data: PreguntaTrivia[]) => {
                this.preguntas = data;
                console.log(this.preguntas)

                // Rellenar la lista de preguntasRandom dependiendo del tipo de usuario
                if (this.usuario) {
                  this.rellenarPreguntasRandom(this.usuario.tipo);
                  console.log(this.usuario.tipo)
                }
              });
            } else {
              console.log('No se encontró el usuario.');
            }
          });
        }
      } else {
        console.log('No hay usuario autenticado');
      }
    });


  }

// Función para rellenar preguntasRandom dependiendo del tipo de usuario
rellenarPreguntasRandom(tipoUsuario: string) {
  // Convertir el tipo de usuario a minúsculas
  const tipoUsuarioLowerCase = tipoUsuario.toLowerCase();

  // Filtrar preguntas por tipo (niño o adulto), también convertido a minúsculas
  const preguntasFiltradas = this.preguntas.filter(pregunta => pregunta.tipo.toLowerCase() === tipoUsuarioLowerCase);

  // Barajar las preguntas
  const preguntasBarajadas = this.shuffleArray(preguntasFiltradas);

  // Limitar a 10 preguntas si es adulto, o 8 si es niño
  if (tipoUsuarioLowerCase === 'adulto') {
    this.preguntasRandom = preguntasBarajadas.slice(0, 10);
  } else if (tipoUsuarioLowerCase === 'niño') {
    this.preguntasRandom = preguntasBarajadas.slice(0, 8);
  }

  console.log('Preguntas Random:', this.preguntasRandom);
}

// Función para barajar el array de preguntas aleatoriamente
shuffleArray(array: PreguntaTrivia[]): PreguntaTrivia[] {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}
}
