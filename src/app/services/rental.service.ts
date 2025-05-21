import { Injectable } from '@angular/core';
import {
  Firestore,
  collection,
  query,
  where,
  getDocs,
  addDoc,
  Timestamp,
} from '@angular/fire/firestore';
import { FirestoreService } from './firestore.service';
import { IndexedDBService } from './indexedDB.service';
import { SyncService } from './sync.service';

@Injectable({ providedIn: 'root' })
export class RentalService {
  constructor(
    private firestore: Firestore,
    private firestoreService: FirestoreService,
    private indexedDBService: IndexedDBService,
    private syncService: SyncService
  ) {}

  async isCarAvailable(
    carId: string,
    startDate: string,
    endDate: string
  ): Promise<boolean> {
    const rentalsRef = collection(this.firestore, 'rentals');
    const q = query(
      rentalsRef,
      where('carId', '==', carId),
      where('startDate', '<=', endDate),
      where('endDate', '>=', startDate)
    );
    const snapshot = await getDocs(q);
    return snapshot.empty;
  }

  async rentCar(
    carId: string,
    userId: string,
    startDate: string,
    endDate: string
  ) {
    const rental = {
      carId,
      userId,
      startDate,
      endDate,
      createdAt: new Date().toISOString(),
    };

    if (navigator.onLine) {
      // Online mentés Firestore-ba
      return await this.firestoreService.addRental(rental);
    } else {
      // Offline mentés IndexedDB-be
      await this.indexedDBService.addRental(rental);
      this.syncService.markPending('rentals', rental); // egyedi szinkronkulcs
      return { offlineSaved: true };
    }
  }
}
