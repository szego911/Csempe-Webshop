import { Injectable } from '@angular/core';
import { FirestoreService } from './firestore.service';
import { IndexedDBService } from './indexedDB.service';
import { SyncService } from './sync.service';
import { Rental } from '../models/rental.model';

@Injectable({ providedIn: 'root' })
export class RentalService {
  constructor(
    private firestoreService: FirestoreService,
    private indexedDBService: IndexedDBService,
    private syncService: SyncService
  ) {}

  async isCarAvailable(
    carId: number,
    startDate: string,
    endDate: string
  ): Promise<boolean> {
    const rentals: Rental[] = await this.indexedDBService.getAllData(
      this.indexedDBService.rentalStore
    );

    // Ellenőrizze, van-e átfedő foglalás helyileg
    const overlapping = rentals.some(
      (rental) =>
        rental.carId === carId &&
        rental.startDate <= endDate &&
        rental.endDate >= startDate
    );

    return !overlapping;
  }

  async rentCar(
    carId: number,
    userId: string,
    startDate: string,
    endDate: string
  ) {
    const rental: Rental = {
      id: crypto.randomUUID(), 
      carId,
      userId,
      startDate,
      endDate,
      createdAt: new Date().toISOString(),
    };

    await this.indexedDBService.addData(
      rental,
      this.indexedDBService.rentalStore
    );
    this.syncService.markPending('rentals', rental);

    return { offlineSaved: true };
  }
}
