import { Injectable } from '@angular/core';
import {
  collection,
  collectionData,
  Firestore,
  addDoc,
  deleteDoc,
  doc,
  CollectionReference,
} from '@angular/fire/firestore';
import { Car } from '../pages/car-list/car.model';
import { Observable } from 'rxjs';
import { firstValueFrom } from 'rxjs';


@Injectable({ providedIn: 'root' })
export class FirestoreService {
  private carsCollection: CollectionReference;

constructor(private firestore: Firestore) {
  this.carsCollection = collection(this.firestore, 'cars');
}


  async getCars(): Promise<Car[]> {
    return firstValueFrom(collectionData(this.carsCollection, { idField: 'id' }) as Observable<Car[]>);
  }

  addCar(car: Car) {
    return addDoc(this.carsCollection, car);
  }

  deleteCar(id: string) {
    const carDoc = doc(this.firestore, `cars/${id}`);
    return deleteDoc(carDoc);
  }
}
