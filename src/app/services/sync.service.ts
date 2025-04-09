import { Injectable } from '@angular/core';
import { FirestoreService } from './firestore.service';
import { IndexedDBService } from './indexedDB.service';
import { Car } from '../pages/car-list/car.model';

@Injectable({ providedIn: 'root' })
export class SyncService {
  constructor(
    private firestoreService: FirestoreService,
    private indexedDBService: IndexedDBService
  ) {
    // Szinkronizálunk, ha visszajön az internet
    window.addEventListener('online', () => {
      this.syncOfflineCarsToFirestore();
    });
  }

  async getCars(): Promise<Car[]> {
    if (navigator.onLine) {
      return await this.firestoreService.getCars();
    } else {
      return await this.indexedDBService.getAllData();
    }
  }

  async addCar(car: Car) {
    if (navigator.onLine) {
      await this.firestoreService.addCar(car);
    } else {
      await this.indexedDBService.addData(car);
    }
  }

  async deleteCar(id: string) {
    if (navigator.onLine) {
      await this.firestoreService.deleteCar(id);
    } else {
      await this.indexedDBService.deleteData(Number(id)); // IndexedDB-ben az id szám
    }
  }

  async syncOfflineCarsToFirestore() {
    const offlineCars = await this.indexedDBService.getAllData();

    for (const car of offlineCars) {
      const { id, ...carData } = car; // Firestore generál új id-t
      await this.firestoreService.addCar(carData);
      await this.indexedDBService.deleteData(id);
    }

    console.log(
      '[SyncService] Offline adatok sikeresen szinkronizálva Firestore-ba.'
    );
  }
}
