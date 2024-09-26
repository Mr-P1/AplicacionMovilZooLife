import { inject, Injectable } from '@angular/core';
import { addDoc, collection, collectionData, doc, DocumentReference, Firestore, getDoc, getDocs, query, setDoc, where } from '@angular/fire/firestore';
import { from, map, Observable } from 'rxjs';
import { Animal } from '../models/animal.model';
import { Reaction } from '../models/reaction.model';

const PATH_ANIMALES = 'Animales';
const PATH_REACCIONES = 'Reacciones';

@Injectable({
  providedIn: 'root'
})
export class FirestoreService {

  constructor() { }


  private _firestore = inject(Firestore);
  private _rutaAnimal = collection(this._firestore, PATH_ANIMALES)
  private _rutaReacciones = collection(this._firestore, PATH_REACCIONES);



  getAnimales(): Observable<Animal[]> {
    return collectionData(this._rutaAnimal,{idField: 'id'}) as Observable<Animal[]>;
  }

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

}