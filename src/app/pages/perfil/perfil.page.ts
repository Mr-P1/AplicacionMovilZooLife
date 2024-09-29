import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { AuthService } from 'src/app/common/services/auth.service';
import { FirestoreService } from 'src/app/common/services/firestore.service';

export interface Usuario{
  id:string,
  correo:string,
  telefono:string,
  nombre:string
}

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.page.html',
  styleUrls: ['./perfil.page.scss'],
  standalone: true,
  imports: [ IonicModule, CommonModule, FormsModule]
})
export class PerfilPage implements OnInit {

  usuario = {
    id: "",
    email:"",
    telefono:"",
    nombre:"",
    tipo:"",
    puntos:0,
    nivel:0
  }

  constructor(
    private authService: AuthService,
    private fireService :FirestoreService
  ) {}

  userId :string = "";


  ngOnInit() {

    this.authService.authState$.subscribe(user => {
      if (user) {
        this.userId = user.uid;
        this.usuario.email = user.email;

        this.fireService.getUsuario(this.userId).subscribe(user=>{
          if(user){
            console.log(user)
            this.usuario.id = user.id,
            this.usuario.nombre = user.nombre,
            this.usuario.telefono = user.nombre,
            this.usuario.tipo = user.tipo,
            this.usuario.puntos = user.puntos,
            this.usuario.nivel = user.nivel

          }
        })

      }


    });


  }

}
