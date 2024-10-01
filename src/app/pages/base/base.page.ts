import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { RouterLink, Router, RouterModule, NavigationEnd } from '@angular/router';
import { AuthService } from 'src/app/common/services/auth.service';
import { ContadorService } from './../../common/services/contador.service';
import { PipesModule } from 'src/app/common/services/pipe.module';
import { map } from 'rxjs/operators';


import { addIcons } from 'ionicons';
import { star,personCircle } from 'ionicons/icons';

@Component({
  selector: 'app-base',
  templateUrl: './base.page.html',
  styleUrls: ['./base.page.scss'],
  standalone: true,
  imports: [IonicModule, RouterLink, RouterModule, CommonModule, PipesModule]
})
export class BasePage implements OnInit {

  private _authState = inject(AuthService);
  private _router = inject(Router);
  private _contadorService = inject(ContadorService);
  tiempoRestante$ = this._contadorService.tiempoRestante$.pipe(
    map(tiempoRestante => tiempoRestante !== null ? tiempoRestante : 0) // Proporcionar un valor predeterminado
  );

  pageTitle: string = 'Home';  // Título por defecto

  constructor() {
    addIcons({ star,personCircle });

    this._router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.updateTitle(this._router.url);
      }
    });
  }

  ngOnInit() {
    this._contadorService.iniciarContador();

    this.tiempoRestante$.subscribe((tiempoRestante) => {
      // console.log(`Tiempo restante: ${tiempoRestante}s`);
    });
  }

  async cerrarSesion() {
    await this._authState.logOut();
    this._router.navigate(['']);
  }

  // Método para actualizar el título basado en la URL
  private updateTitle(url: string) {
    if (url.includes('home')) {
      this.pageTitle = 'Inicio';
    } else if (url.includes('perfil')) {
      this.pageTitle = 'Perfil';
    } else if (url.includes('trivia')) {
      this.pageTitle = 'Trivia';
    } else if (url.includes('events')) {
      this.pageTitle = 'Eventos';
    } else if (url.includes('mapa')) {
      this.pageTitle = 'Mapa';
    } else if (url.includes('animal-info')) {
      this.pageTitle = 'Información'; // Nuevo título para la página de animal-info
    } else {
      this.pageTitle = 'Menú';  // Título por defecto
    }
  }
  



}
