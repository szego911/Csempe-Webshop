import { Injectable } from '@angular/core';
import { FirestoreService } from './firestore.service';
import { IndexedDBService } from './indexedDB.service';
import { Car } from '../models/car.model';

@Injectable({ providedIn: 'root' })
export class SyncService {
  constructor(
    private firestoreService: FirestoreService,
    private indexedDBService: IndexedDBService
  ) {
    // Ha visszajön az internet, próbáljunk szinkronizálni
    window.addEventListener('online', async () => {
      await this.syncCarsToFirestore();
      await this.syncPendingRentals();
    });
  }

  async refreshCarsFromFirestore(): Promise<void> {
    if (!navigator.onLine) return;

    try {
      const cars = await this.firestoreService.getCars();
      await this.indexedDBService.clearStore(this.indexedDBService.carStore);
      for (const car of cars) {
        await this.indexedDBService.addData(
          car,
          this.indexedDBService.carStore
        );
      }
      console.log('[SyncService] Autók frissítve Firestore → IndexedDB');
    } catch (err) {
      console.error('[SyncService] Hiba autók frissítésekor:', err);
    }
  }

  async refreshRentalsFromFirestore(): Promise<void> {
    if (!navigator.onLine) return;

    try {
      const rentals = await this.firestoreService.getAllRentals();
      await this.indexedDBService.clearStore(this.indexedDBService.rentalStore);
      for (const rental of rentals) {
        await this.indexedDBService.addData(
          rental,
          this.indexedDBService.rentalStore
        );
      }
      console.log('[SyncService] Foglalások frissítve Firestore → IndexedDB');
    } catch (err) {
      console.error('[SyncService] Hiba foglalások frissítésekor:', err);
    }
  }

  async getCars(): Promise<Car[]> {
    return await this.indexedDBService.getAllData(
      this.indexedDBService.carStore
    );
  }

  async addCar(car: Car) {
    await this.indexedDBService.addData(car, this.indexedDBService.carStore);
  }

  async deleteCar(id: string) {
    await this.indexedDBService.deleteData(
      Number(id),
      this.indexedDBService.carStore
    );
  }

  async syncCarsToFirestore() {
    if (!navigator.onLine) return;

    const localCars = await this.indexedDBService.getAllData(
      this.indexedDBService.carStore
    );
    const remoteCars = await this.firestoreService.getCars();

    const remoteIds = new Set(remoteCars.map((c) => c.id));

    for (const car of localCars) {
      if (!remoteIds.has(car.id)) {
        await this.firestoreService.addCar(car);
      }
    }

    console.log('[SyncService] Autók szinkronizálva IndexedDB → Firestore');
  }

  async syncPendingRentals() {
    if (!navigator.onLine) return;

    const pending = await this.indexedDBService.getAllPendingRentals();

    for (const rental of pending) {
      try {
        await this.firestoreService.addRental(rental);
        console.log(`[SYNC] Foglalás feltöltve: ${rental.id}`);
      } catch (error) {
        console.error(
          `[SYNC] Foglalás feltöltése sikertelen: ${rental.id}`,
          error
        );
      }
    }
  }

  markPending(collection: string, data: any): void {
    console.log(`[SyncService] Függőben lévő elem: '${collection}'`, data);
  }
}
