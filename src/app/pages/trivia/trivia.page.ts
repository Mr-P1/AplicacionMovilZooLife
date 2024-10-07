import { Component, OnInit, OnDestroy } from '@angular/core';
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
export class TriviaPage implements OnInit, OnDestroy {
  preguntas: PreguntaTrivia[] = [];
  preguntasRandom: PreguntaTrivia[] = [];
  preguntaActual: PreguntaTrivia | null = null;
  preguntaIndex: number = 0;
  tiempoRestante: number = 10; // Tiempo en segundos por pregunta
  circumference: number = 2 * Math.PI * 45; // Circunferencia del círculo (r=45)

  respuestasCorrectas: number = 0;
  temporizador: any;
  usuario: Usuario | null = null; // Asegúrate de que 'usuario' esté declarada aquí


  constructor(
    private preguntaService: FirestoreService,
    private authService: AuthService
  ) { }

  ngOnInit() {
    this.authService.authState$.subscribe(user => {
      if (user) {
        this.preguntaService.getUsuarioID(user.uid).subscribe((data: Usuario | null) => {
          if (data) {
            this.usuario = data;
            this.preguntaService.getPreguntasTriviaPorAnimalesVistos(user.uid).subscribe((preguntas: PreguntaTrivia[]) => {
              this.preguntas = preguntas;
              this.rellenarPreguntasRandom(data.tipo);
              this.mostrarPregunta();
            });
          }
        });
      }
    });

  }


  ngOnDestroy() {
    // Limpia el temporizador cuando el componente se destruye
    clearInterval(this.temporizador);
  }

  // Muestra la siguiente pregunta o finaliza el juego si no hay más preguntas
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
    this.tiempoRestante = 10; // Reiniciar el temporizador a 15 segundos
    clearInterval(this.temporizador); // Limpiamos cualquier temporizador anterior
    this.temporizador = setInterval(() => {
      if (this.tiempoRestante > 0) {
        this.tiempoRestante--;
      } else {
        clearInterval(this.temporizador); // Limpiamos el temporizador si llega a 0
        this.mostrarPregunta(); // Cambiamos a la siguiente pregunta automáticamente
      }
    }, 1000);
  }

  seleccionarRespuesta(pregunta: PreguntaTrivia, respuesta: string) {
    if (!pregunta.respondida) {
      pregunta.respondida = true;
      pregunta.respuestaCorrecta = (respuesta === pregunta.respuesta_correcta);

      if (pregunta.respuestaCorrecta) {
        this.respuestasCorrectas++;
      }

      clearInterval(this.temporizador); // Detenemos el temporizador cuando se selecciona una respuesta
      setTimeout(() => this.mostrarPregunta(), 1000); // Mostramos la siguiente pregunta tras 1 segundo
    }
  }

  rellenarPreguntasRandom(tipoUsuario: string) {
    const tipoUsuarioLowerCase = tipoUsuario.toLowerCase();
    const preguntasFiltradas = this.preguntas.filter(pregunta => pregunta.tipo.toLowerCase() === tipoUsuarioLowerCase);
    this.preguntasRandom = this.shuffleArray(preguntasFiltradas).slice(0, tipoUsuarioLowerCase === 'adulto' ? 10 : 8);
  }

  finalizarTrivia() {
    // Muestra el resultado final
    alert(`Has respondido correctamente a ${this.respuestasCorrectas} preguntas.`);
  }

  shuffleArray(array: PreguntaTrivia[]): PreguntaTrivia[] {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }
}
