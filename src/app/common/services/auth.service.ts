import { Injectable,inject } from '@angular/core';
import {Auth,authState,signOut,signInWithEmailAndPassword} from '@angular/fire/auth'
import { Observable } from 'rxjs';


export interface User {
  email: string;
  password: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor() { }


  private _auth = inject(Auth);


  get authState$():Observable<any> {
    return authState(this._auth);
  }

  logOut(){
    return signOut(this._auth);
  }

  logearse(user:User){
    return  signInWithEmailAndPassword(this._auth,user.email,user.password)
  }

}
