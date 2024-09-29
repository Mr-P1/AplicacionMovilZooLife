import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { RouterLink, Router, RouterModule } from '@angular/router';
import { AuthService } from 'src/app/common/services/auth.service';
import { ContadorService } from './../../common/services/contador.service';
import { PipesModule } from 'src/app/common/services/pipe.module';
import { map } from 'rxjs/operators';

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

  constructor() { }

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



}
