import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class IndexedDBService {
  private dbName = 'CarsDB';
  public readonly carStore = 'cars';
  public readonly rentalStore = 'rentals';
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

        if (!db.objectStoreNames.contains(this.carStore)) {
          db.createObjectStore(this.carStore, {
            keyPath: 'id',
          });
        }

        if (!db.objectStoreNames.contains(this.rentalStore)) {
          db.createObjectStore(this.rentalStore, {
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

  // ───── Általános metódusok ─────

  async addData(data: any, storeName: string): Promise<void> {
    await this.initReady;
    const dataToAdd = { ...data };

    // Ha nincs id vagy autoIncrement van, ne adjuk hozzá manuálisan
    if (!dataToAdd.id) {
      dataToAdd.id = crypto.randomUUID();
    }

    return new Promise((resolve, reject) => {
      const tx = this.db.transaction(storeName, 'readwrite');
      const store = tx.objectStore(storeName);
      const request = store.add(dataToAdd);
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  async getAllData(storeName: string): Promise<any[]> {
    await this.initReady;
    return new Promise((resolve, reject) => {
      const tx = this.db.transaction(storeName, 'readonly');
      const store = tx.objectStore(storeName);
      const request = store.getAll();
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  async updateData(data: any, storeName: string): Promise<void> {
    await this.initReady;
    return new Promise((resolve, reject) => {
      const tx = this.db.transaction(storeName, 'readwrite');
      const store = tx.objectStore(storeName);
      const request = store.put(data);
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  async deleteData(id: string | number, storeName: string): Promise<void> {
    await this.initReady;
    return new Promise((resolve, reject) => {
      const tx = this.db.transaction(storeName, 'readwrite');
      const store = tx.objectStore(storeName);
      const request = store.delete(id);
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  async clearStore(storeName: string): Promise<void> {
    await this.initReady;
    return new Promise((resolve, reject) => {
      const tx = this.db.transaction(storeName, 'readwrite');
      const store = tx.objectStore(storeName);
      const request = store.clear();
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  // ───── Speciális rövidítések (opcionális) ─────

  async addRental(rental: any): Promise<void> {
    return await this.addData(rental, this.rentalStore);
  }

  async getAllPendingRentals(): Promise<any[]> {
    return await this.getAllData(this.rentalStore);
  }

  async removeRental(id: string): Promise<void> {
    return await this.deleteData(id, this.rentalStore);
  }
}
