import { Component, OnInit, OnDestroy } from '@angular/core';
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
export class TriviaPage implements OnInit, OnDestroy {
  preguntas: PreguntaTrivia[] = [];
  preguntasRandom: PreguntaTrivia[] = [];
  preguntaActual: PreguntaTrivia | null = null;
  preguntaIndex: number = 0;
  tiempoRestante: number = 10; // Tiempo en segundos por pregunta
  circumference: number = 2 * Math.PI * 45; // Circunferencia del círculo (r=45)
  respuestasCorrectas: number = 0;
  temporizador: any;
  usuario: Usuario | null = null;
  userId: string = '';
  animalesVistosCount: number = 0;
  puedeHacerTrivia: boolean = false;
  loading: boolean = true; // Variable para controlar el estado de carga

  constructor(
    private preguntaService: FirestoreService,
    private authService: AuthService,
    private _router: Router
  ) {}

  ngOnInit() {
    this.authService.authState$.subscribe((user) => {
      if (user) {
        this.userId = user.uid;
        this.preguntaService.getUsuarioID(this.userId).subscribe((data: Usuario | null) => {
          if (data) {
            this.usuario = data;
            this.preguntaService.getAnimalesVistosPorUsuario(this.userId).subscribe((animalesVistos) => {
              this.animalesVistosCount = animalesVistos.length;
              this.puedeHacerTrivia = this.animalesVistosCount >= 5;

              if (this.puedeHacerTrivia) {
                this.preguntaService.getPreguntasTriviaPorAnimalesVistos(this.userId).subscribe((preguntas: PreguntaTrivia[]) => {
                  this.preguntas = preguntas;
                  this.rellenarPreguntasRandom(data.tipo);
                  this.mostrarPregunta();
                  this.loading = false; // Datos cargados, desactiva la carga
                });
              }else {
                this.loading = false; // No puede hacer trivia, pero los datos han cargado
              }
            });
          }else {
            this.loading = false; // No puede hacer trivia, pero los datos han cargado
          }
        });
      }else {
        this.loading = false; // No puede hacer trivia, pero los datos han cargado
      }
    });
  }

  ngOnDestroy() {
    clearInterval(this.temporizador);
  }

  mostrarPregunta() {
    if (this.preguntaIndex < this.preguntasRandom.length) {
      this.preguntaActual = this.preguntasRandom[this.preguntaIndex];
      this.preguntaIndex++;
      this.iniciarTemporizador();
    } else {
      this.finalizarTrivia();
    }
  }

  iniciarTemporizador() {
    this.tiempoRestante = 10; // Reiniciar el temporizador a 10 segundos
    clearInterval(this.temporizador);
    this.temporizador = setInterval(() => {
      if (this.tiempoRestante > 0) {
        this.tiempoRestante--;
      } else {
        clearInterval(this.temporizador);
        this.mostrarPregunta();
      }
    }, 1000);
  }

  seleccionarRespuesta(pregunta: PreguntaTrivia, respuesta: string) {
    if (pregunta.respondida) return;

    pregunta.respondida = true;
    pregunta.respuestaCorrecta = respuesta === pregunta.respuesta_correcta;

    if (pregunta.respuestaCorrecta) {
      this.respuestasCorrectas++;
    }

    clearInterval(this.temporizador);
    setTimeout(() => this.mostrarPregunta(), 1000); // Mostramos la siguiente pregunta tras 1 segundo

    if (this.todasLasPreguntasRespondidas()) {
      this.enviarRespuestas();
    }
  }

  todasLasPreguntasRespondidas(): boolean {
    return this.preguntasRandom.every((pregunta) => pregunta.respondida);
  }

  rellenarPreguntasRandom(tipoUsuario: string) {
    const tipoUsuarioLowerCase = tipoUsuario.toLowerCase();
    const preguntasFiltradas = this.preguntas.filter((pregunta) => pregunta.tipo.toLowerCase() === tipoUsuarioLowerCase);
    this.preguntasRandom = this.shuffleArray(preguntasFiltradas).slice(0, tipoUsuarioLowerCase === 'adulto' ? 10 : 8);
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

      const respuesta = {
        resultado: respuestaCorrecta,
        user_id: this.userId,
        pregunta_id: pregunta.id,
        fecha: new Date()
      };

      this.preguntaService.guardarRespuestaTrivia(respuesta).subscribe(() => {
        console.log('Respuesta guardada en Firestore');
      });

      if (respuestaCorrecta) {
        nivelGanado += 3; // 3 puntos de nivel por respuesta correcta
        puntosGanados += this.usuario?.tipo.toLowerCase() === 'adulto' ? 10 : 5;
      }
    }

    const nuevoPuntaje = this.usuario.puntos + puntosGanados;
    const nuevoNivel = this.usuario.nivel + nivelGanado;

    this.preguntaService.actualizarUsuario(this.userId, { puntos: nuevoPuntaje, nivel: nuevoNivel }).subscribe(() => {
      console.log('Usuario actualizado correctamente');
    });

    console.log(`Respuestas guardadas. Puntos ganados: ${puntosGanados}, Nivel ganado: ${nivelGanado}`);
    this._router.navigate(['/app/home']);
  }

  finalizarTrivia() {
    alert(`Has respondido correctamente a ${this.respuestasCorrectas} preguntas.`);
    this.enviarRespuestas();
  }
}
