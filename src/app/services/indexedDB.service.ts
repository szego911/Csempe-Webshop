import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class IndexedDBService {
  private dbName = 'CarsDB';
  private carStore = 'cars';
  private rentalStore = 'rentals';
  private db!: IDBDatabase;
  private initReady: Promise<void>;

  constructor() {
    this.initReady = this.initDB();
  }

  private initDB(): Promise<void> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, 2);

      request.onupgradeneeded = () => {
        const db = request.result;

        // cars tároló
        if (!db.objectStoreNames.contains('cars')) {
          db.createObjectStore('cars', {
            keyPath: 'id',
            autoIncrement: true,
          });
        }

        // rentals tároló
        if (!db.objectStoreNames.contains('rentals')) {
          db.createObjectStore('rentals', {
            keyPath: 'id',
          });
        }
      };

      request.onsuccess = () => {
        this.db = request.result;
        console.log('[IndexedDB] Database initialized successfully');
        resolve();
      };

      request.onerror = () => {
        console.error(
          '[IndexedDB] Error initializing database:',
          request.error
        );
        reject(request.error);
      };
    });
  }

  // ─────────────── AUTÓK ───────────────
  async addData(data: any): Promise<void> {
    await this.initReady;
    const dataToAdd = JSON.parse(JSON.stringify(data));
    if ('id' in dataToAdd) delete dataToAdd.id;

    return new Promise((resolve, reject) => {
      const tx = this.db.transaction(this.carStore, 'readwrite');
      const store = tx.objectStore(this.carStore);
      const request = store.add(dataToAdd);
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  async getAllData(): Promise<any[]> {
    await this.initReady;
    return new Promise((resolve, reject) => {
      const tx = this.db.transaction(this.carStore, 'readonly');
      const store = tx.objectStore(this.carStore);
      const request = store.getAll();
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  async updateData(data: any): Promise<void> {
    await this.initReady;
    return new Promise((resolve, reject) => {
      const tx = this.db.transaction(this.carStore, 'readwrite');
      const store = tx.objectStore(this.carStore);
      const request = store.put(data);
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  async deleteData(id: number): Promise<void> {
    await this.initReady;
    return new Promise((resolve, reject) => {
      const tx = this.db.transaction(this.carStore, 'readwrite');
      const store = tx.objectStore(this.carStore);
      const request = store.delete(id);
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  // ─────────────── BÉRLÉSEK ───────────────

  async addRental(rental: any): Promise<void> {
    await this.initReady;
    const data = { ...rental, id: crypto.randomUUID() };

    return new Promise((resolve, reject) => {
      const tx = this.db.transaction(this.rentalStore, 'readwrite');
      const store = tx.objectStore(this.rentalStore);
      const request = store.add(data);
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  async getAllPendingRentals(): Promise<any[]> {
    await this.initReady;
    return new Promise((resolve, reject) => {
      const tx = this.db.transaction(this.rentalStore, 'readonly');
      const store = tx.objectStore(this.rentalStore);
      const request = store.getAll();
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  async removeRental(id: string): Promise<void> {
    await this.initReady;
    return new Promise((resolve, reject) => {
      const tx = this.db.transaction(this.rentalStore, 'readwrite');
      const store = tx.objectStore(this.rentalStore);
      const request = store.delete(id);
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }
}
