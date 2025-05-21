import { Injectable } from '@angular/core';
import {
  collection,
  collectionData,
  Firestore,
  addDoc,
  deleteDoc,
  doc,
  CollectionReference,
  Timestamp,
} from '@angular/fire/firestore';
import { Car } from '../models/car.model';
import { Observable } from 'rxjs';
import { firstValueFrom } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class FirestoreService {
  private carsCollection: CollectionReference;

  constructor(private firestore: Firestore) {
    this.carsCollection = collection(this.firestore, 'cars');
  }

  async getCars(): Promise<Car[]> {
    return firstValueFrom(
      collectionData(this.carsCollection, { idField: 'id' }) as Observable<
        Car[]
      >
    );
  }

  addCar(car: Car) {
    return addDoc(this.carsCollection, car);
  }

  deleteCar(id: string) {
    const carDoc = doc(this.firestore, `cars/${id}`);
    return deleteDoc(carDoc);
  }

  async addRental(rental: any) {
  const rentalsRef = collection(this.firestore, 'rentals');
  return await addDoc(rentalsRef, {
    ...rental,
    createdAt: Timestamp.now(),
  });
}
}
