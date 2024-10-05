import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { PreguntaTrivia } from 'src/app/common/models/trivia.models';
import { FirestoreService } from 'src/app/common/services/firestore.service';
import { AuthService } from './../../common/services/auth.service';
import { Usuario } from 'src/app/common/models/usuario.model';
import { RouterLink, Router } from '@angular/router';

@Component({
  selector: 'app-trivia',
  templateUrl: './trivia.page.html',
  styleUrls: ['./trivia.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, RouterLink],
})
export class TriviaPage implements OnInit {
  preguntas: PreguntaTrivia[] = [];
  preguntasRandom: PreguntaTrivia[] = [];
  userId: string = '';
  usuario: Usuario | null = null;
  respuestasCorrectas: number = 0;
  animalesVistosCount: number = 0;
  puedeHacerTrivia: boolean = false;

  constructor(
    private preguntaService: FirestoreService,
    private authService: AuthService,
    private _router: Router
  ) {}

  seleccionarRespuesta(pregunta: PreguntaTrivia, respuesta: string) {
    if (pregunta.respondida) {
      return;
    }

    pregunta.respondida = true;
    pregunta.respuestaCorrecta = respuesta === pregunta.respuesta_correcta;

    if (pregunta.respuestaCorrecta) {
      console.log('¡Respuesta correcta!');
      this.respuestasCorrectas++;
    } else {
      console.log('Respuesta incorrecta');
    }

    console.log(this.respuestasCorrectas);

    // Si todas las preguntas han sido respondidas, enviamos las respuestas
    if (this.todasLasPreguntasRespondidas()) {
      this.enviarRespuestas();
    }
  }

  todasLasPreguntasRespondidas(): boolean {
    return this.preguntasRandom.every((pregunta) => pregunta.respondida);
  }

  ngOnInit() {
    this.authService.authState$.subscribe((user) => {
      if (user) {
        this.userId = user.uid;
        console.log('User ID obtenido:', this.userId);

        if (this.userId) {
          this.preguntaService.getUsuarioID(this.userId).subscribe((data: Usuario | null) => {
            if (data) {
              this.usuario = data;
              console.log('Usuario obtenido:', this.usuario);

              this.preguntaService.getAnimalesVistosPorUsuario(this.userId).subscribe((animalesVistos) => {
                this.animalesVistosCount = animalesVistos.length;
                console.log(`El usuario ha visto ${this.animalesVistosCount} animales.`);

                this.puedeHacerTrivia = this.animalesVistosCount >= 5;

                if (this.puedeHacerTrivia) {
                  this.preguntaService
                    .getPreguntasTriviaPorAnimalesVistos(this.userId)
                    .subscribe((data: PreguntaTrivia[]) => {
                      this.preguntas = data;
                      console.log(this.preguntas);

                      if (this.usuario) {
                        this.rellenarPreguntasRandom(this.usuario.tipo);
                        console.log(this.usuario.tipo);
                      }
                    });
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

  rellenarPreguntasRandom(tipoUsuario: string) {
    const tipoUsuarioLowerCase = tipoUsuario.toLowerCase();
    const preguntasFiltradas = this.preguntas.filter((pregunta) => pregunta.tipo.toLowerCase() === tipoUsuarioLowerCase);
    const preguntasBarajadas = this.shuffleArray(preguntasFiltradas);

    if (tipoUsuarioLowerCase === 'adulto') {
      this.preguntasRandom = preguntasBarajadas.slice(0, 10);
    } else if (tipoUsuarioLowerCase === 'niño') {
      this.preguntasRandom = preguntasBarajadas.slice(0, 8);
    }

    console.log('Preguntas Random:', this.preguntasRandom);
  }

  shuffleArray(array: PreguntaTrivia[]): PreguntaTrivia[] {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }

  async enviarRespuestas() {
    if (!this.usuario || !this.userId) {
      console.error('No se pudo obtener el usuario o userId');
      return;
    }

    let puntosGanados = 0;
    let nivelGanado = 0;

    for (const pregunta of this.preguntasRandom) {
      const respuestaCorrecta = pregunta.respuestaCorrecta ?? false;

      // Estructura de la respuesta para guardar en Firestore
      const respuesta = {
        resultado: respuestaCorrecta,
        user_id: this.userId,
        pregunta_id: pregunta.id
      };

      // Guardar respuesta en Firestore
      this.preguntaService.guardarRespuestaTrivia(respuesta).subscribe(() => {
        console.log('Respuesta guardada en Firestore');
      });

      // Actualizar puntos y nivel según el tipo de usuario
      if (respuestaCorrecta) {
        nivelGanado += 3; // 3 puntos de nivel por respuesta correcta
        if (this.usuario?.tipo.toLowerCase() === 'adulto') {
          puntosGanados += 10;
        } else {
          puntosGanados += 5;
        }
      }
    }

    // Actualizar usuario en Firestore con los nuevos puntos y nivel
    const nuevoPuntaje = this.usuario.puntos + puntosGanados;
    const nuevoNivel = this.usuario.nivel + nivelGanado;
    this.preguntaService.actualizarUsuario(this.userId, { puntos: nuevoPuntaje, nivel: nuevoNivel }).subscribe(() => {
      console.log('Usuario actualizado correctamente');
    });

    console.log(`Respuestas guardadas. Puntos ganados: ${puntosGanados}, Nivel ganado: ${nivelGanado}`);

    this._router.navigate(['/app/home']);
  }
}
