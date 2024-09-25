import { inject, Injectable } from '@angular/core';
import { collection, collectionData, doc, Firestore, getDoc } from '@angular/fire/firestore';
import { from, map, Observable } from 'rxjs';
import { Animal } from '../models/animal.model';



const PATH = 'Animales';

@Injectable({
  providedIn: 'root'
})
export class FirestoreService {

  constructor() { }


  private _firestore = inject(Firestore);
  private _rutaAnimal = collection(this._firestore, PATH)


  getAnimales(): Observable<Animal[]> {
    return collectionData(this._rutaAnimal,{idField: 'id'}) as Observable<Animal[]>;
  }

  getAnimal(id: string): Observable<Animal | null> {
    const docRef = doc(this._rutaAnimal, id);
    return from(getDoc(docRef)).pipe(
      map(doc => doc.exists() ? { id: doc.id, ...doc.data() } as Animal : null)
    );
  }


}