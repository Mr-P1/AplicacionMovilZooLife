import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { AuthService } from 'src/app/common/services/auth.service';

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
    nombre:""
  }

  constructor(
    private authService: AuthService
  ) {}

  userId :string = "";


  ngOnInit() {

    this.authService.authState$.subscribe(user => {
      if (user) {
        this.userId = user.uid;
        this.usuario =user;
      }


    });


  }

}
