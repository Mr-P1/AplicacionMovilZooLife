import { Component,inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule,FormBuilder, FormControl,Validators } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { RouterLink,Router } from '@angular/router';
import {AuthService} from './../../common/services/auth.service'

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule,RouterLink,ReactiveFormsModule]
})
export class LoginPage  {

  constructor() { }




  private _formBuilder = inject(FormBuilder);
  private _authService = inject(AuthService)
  private _router = inject(Router);


  form = this._formBuilder.group(
    {
      email:this._formBuilder.control('',[Validators.required,Validators.email]),
      password:this._formBuilder.control('',[Validators.required, Validators.minLength(5)]),
      boleta:this._formBuilder.control('',[Validators.required])

    }
  )

  async submit() {

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;

    }

    try {
      const { email, password } = this.form.value;

      if (!email || !password) return;

      await this._authService.logearse({ email, password });
      this._router.navigate(['/app/home']);


    } catch (error) {



    }



  }

}
