import { Injectable,inject } from '@angular/core';
import {Auth,authState,signOut,signInWithEmailAndPassword, getAuth,createUserWithEmailAndPassword} from '@angular/fire/auth'
import { Observable } from 'rxjs';
import { addDoc, collectionData, doc, DocumentReference, Firestore, getDoc, getDocs, query, setDoc, where,collection } from '@angular/fire/firestore';



const PATH_USUARIOS = 'Usuarios';

export interface Usuario {
  id: string;
  nombre:string,
  telefono:number,
  auth_id:string,
}


//Lo siguiente tiene para omitir el id porque recien lo vamos a crear
export type CrearUsuario = Omit<Usuario, 'id'>


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
  private _firestore=inject(Firestore)
  private _rutaUsuarios = collection(this._firestore, PATH_USUARIOS)




  get authState$():Observable<any> {
    return authState(this._auth);
  }


  logOut(){
    return signOut(this._auth);
  }

  logearse(user:User){
    return  signInWithEmailAndPassword(this._auth,user.email,user.password)
  }


  async registrarse(email: string, password: string, nombre: string, telefono: number) {
    try {

      const userCredential = await createUserWithEmailAndPassword(this._auth, email, password);
      const user = userCredential.user;

      const nuevo_usuario:CrearUsuario = {
        nombre:nombre,
        telefono:telefono,
        auth_id: user.uid,

      }

      await addDoc(this._rutaUsuarios,nuevo_usuario);



    }catch{

    }}


}
