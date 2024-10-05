import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { AuthService } from 'src/app/common/services/auth.service';
import {Usuario} from '../../common/models/usuario.model'

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.page.html',
  styleUrls: ['./perfil.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class PerfilPage implements OnInit {
  usuario: Usuario | null = null;  // Variable para almacenar los datos del usuario
  uid: string | null = null;
  email !: string ;

  constructor(private authService: AuthService) {}



  async ngOnInit() {
    // Obtener el UID del usuario actual
    this.uid = this.authService.currentUserId;
    console.log('UID del usuario actual:', this.uid);

    this.usuario = await this.authService.getUsuarioFirestore(this.uid!);
  }


}
