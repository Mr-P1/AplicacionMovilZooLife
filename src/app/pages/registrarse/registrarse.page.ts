import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormControl, Validators } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { RouterLink, Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { AuthService } from './../../common/services/auth.service'

import { addIcons } from 'ionicons';
import { mailOutline,keyOutline, personOutline, callOutline } from 'ionicons/icons';



@Component({
  selector: 'app-registrarse',
  templateUrl: './registrarse.page.html',
  styleUrls: ['./registrarse.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule,RouterLink,ReactiveFormsModule]
})
export class RegistrarsePage {



  constructor(
    private alertController: AlertController
  ) {
    addIcons({  mailOutline, keyOutline, personOutline ,callOutline})
   }

  private _formBuilder = inject(FormBuilder);
  private _authService = inject(AuthService)
  private _router = inject(Router);

  form = this._formBuilder.group({
    email: this._formBuilder.control('', [Validators.required, Validators.email]),
    password: this._formBuilder.control('', [Validators.required, Validators.minLength(5)]),
    nombre: this._formBuilder.control('', [Validators.required]),
    telefono: this._formBuilder.control('', [Validators.required]),
    tipo:this._formBuilder.control('', [Validators.required]),
  });


  async submit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    try {
      const { email, password, telefono, nombre, tipo } = this.form.value;

      if (!email || !password) return;

      await this._authService.registrarse(email, password, String(nombre), String(telefono), String(tipo));

      this._router.navigate(['/']);
    } catch (error: any) {
      // Llama a la función que muestra la alerta
      this.showAlert('Error en el registro', error.message);
    }
  }

  // Función para mostrar la alerta
  async showAlert(header: string, message: string) {
    const alert = await this.alertController.create({
      header,
      message,
      buttons: ['OK']
    });
    await alert.present();
  }



}
