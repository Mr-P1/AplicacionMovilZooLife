import { inject, Injectable } from '@angular/core';
import { addDoc, collection, collectionData, doc, DocumentReference, Firestore, getDoc, getDocs, query, setDoc, updateDoc, where } from '@angular/fire/firestore';
import { catchError, from, map, Observable, of, switchMap, throwError } from 'rxjs';
import { Animal } from '../models/animal.model';
import { Reaction } from '../models/reaction.model';
import {Usuario} from '../models/usuario.model';
import { PreguntaTrivia } from '../models/trivia.models';


const PATH_ANIMALES        = 'Animales';
const PATH_REACCIONES      = 'Reacciones';
const PATH_USUARIOS        = 'Usuarios';
const PATH_ANIMALES_VISTOS = 'AnimalesVistos';
const PATH_PREGUNTAS_TRIVIA         = 'Preguntas'

@Injectable({
  providedIn: 'root'
})
export class FirestoreService {

  constructor() { }


  private _firestore          = inject(Firestore);
  private _rutaAnimal         = collection(this._firestore, PATH_ANIMALES)
  private _rutaReacciones     = collection(this._firestore, PATH_REACCIONES);
  private _rutaUsuarios       = collection(this._firestore, PATH_USUARIOS);
  private _rutaAnimalesVistos = collection(this._firestore, PATH_ANIMALES_VISTOS);
  private _preguntasTrivia             = collection(this._firestore, PATH_PREGUNTAS_TRIVIA)




  //Método para obtener animales
  getAnimales(): Observable<Animal[]> {
    return collectionData(this._rutaAnimal,{idField: 'id'}) as Observable<Animal[]>;
  }

  //Método para obtener anial por ID
  getAnimal(id: string): Observable<Animal | null> {
    const docRef = doc(this._rutaAnimal, id);
    return from(getDoc(docRef)).pipe(
      map(doc => doc.exists() ? { id: doc.id, ...doc.data() } as Animal : null)
    );
  }

  // Método para obtener reacciones de un usuario por animal
  getUserReaction(animalId: string, userId: string): Observable<Reaction | null> {
    const reactionsQuery = query(
      this._rutaReacciones,
      where('animalId', '==', animalId),
      where('userId', '==', userId)
    );
    return from(getDocs(reactionsQuery)).pipe(
      map(snapshot => {
        if (!snapshot.empty) {
          const data = snapshot.docs[0].data() as Reaction;
          return { id: snapshot.docs[0].id, ...data } as Reaction;
        }
        return null;
      })
    );
  }

  // Método para actualizar una reacción
  updateReaction(id: string, reaction: Partial<Reaction>): Observable<void> {
    const docRef = doc(this._rutaReacciones, id);
    return from(setDoc(docRef, reaction, { merge: true }));
  }

  addReaction(reaction: Reaction): Observable<DocumentReference> {
    return from(addDoc(this._rutaReacciones, reaction));
  }


  getUsuario(id: string): Observable<Usuario | null> {
    const docRef = doc(this._rutaUsuarios, id);
    return from(getDoc(docRef)).pipe(
      map(doc => doc.exists() ? { id: doc.id, ...doc.data() } as Usuario : null)
    );
  }

  getUsuarioID(authId: string): Observable<Usuario | null> {
    const usuariosQuery = query(this._rutaUsuarios, where('auth_id', '==', authId));
    return from(getDocs(usuariosQuery)).pipe(
      map(snapshot => {
        if (!snapshot.empty) {
          const docData = snapshot.docs[0].data() as Usuario;
          const id = snapshot.docs[0].id;
          return { ...docData, id };  // Propaga los datos y luego agrega el campo 'id'
        }
        return null;
      }),
      catchError(err => {
        console.error('Error al obtener el usuario:', err);
        return of(null);
      })
    );
  }




   // Método para guardar el animal visto
   guardarAnimalVisto(userId: string, animalId: string): Observable<void> {
    const animalVisto = {
      userId: userId,
      animalId: animalId,
      vistoEn: new Date().toISOString()
    };
    return from(addDoc(this._rutaAnimalesVistos, animalVisto)).pipe(map(() => {}));
  }

  // Método para verificar si el usuario ya ha visto el animal
  usuarioHaVistoAnimal(userId: string, animalId: string): Observable<boolean> {
    const q = query(
      this._rutaAnimalesVistos,
      where('userId', '==', userId),
      where('animalId', '==', animalId)
    );

    return from(getDocs(q)).pipe(
      map(snapshot => !snapshot.empty) // Retorna true si existe un registro
    );
  }

  getPreguntasTriviaPorAnimalesVistos(userId: string): Observable<PreguntaTrivia[]> {
    // Primero, obtenemos los animales vistos por el usuario
    const animalesVistosQuery = query(this._rutaAnimalesVistos, where('userId', '==', userId));

    return from(getDocs(animalesVistosQuery)).pipe(
      map(snapshot => snapshot.docs.map(doc => doc.data()['animalId'])), // Accede a 'animalId' usando corchetes
      switchMap((animalIds: string[]) => {
        // Ahora obtenemos las preguntas de trivia asociadas a esos animales
        if (animalIds.length > 0) {
          const preguntasQuery = query(this._preguntasTrivia, where('animal_id', 'in', animalIds));
          return collectionData(preguntasQuery, { idField: 'id' }) as Observable<PreguntaTrivia[]>;
        } else {
          // Si no hay animales vistos, devolvemos una lista vacía
          return of([]);
        }
      })
    );
  }

  getAnimalesVistosPorUsuario(userId: string): Observable<any[]> {
    const animalesVistosRef = collection(this._firestore, 'AnimalesVistos');
    const q = query(animalesVistosRef, where('userId', '==', userId));
    return collectionData(q, { idField: 'id' });
  }


  actualizarUsuario(userId: string, data: Partial<Usuario>): Observable<void> {
    const usuariosQuery = query(this._rutaUsuarios, where('auth_id', '==', userId));

    // Primero obtenemos el documento donde auth_id coincide con el userId
    return from(getDocs(usuariosQuery)).pipe(
      switchMap((snapshot) => {
        if (!snapshot.empty) {
          const userDocRef = doc(this._firestore, `Usuarios/${snapshot.docs[0].id}`);
          // Luego, actualizamos el documento con los datos proporcionados
          return from(updateDoc(userDocRef, data));
        } else {
          // Si no se encuentra el usuario, devolvemos un error
          return throwError(() => new Error('Usuario no encontrado'));
        }
      })
    );
  }
  guardarRespuestaTrivia(respuesta: { resultado: boolean, user_id: string, pregunta_id: string }): Observable<void> {
    const respuestasTriviaRef = collection(this._firestore, 'RespuestasTrivia');
    return from(addDoc(respuestasTriviaRef, respuesta)).pipe(map(() => {}));
  }




}
