import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class IndexedDBService {
  private dbName = 'CarsDB';
  private storeName = 'cars';
  private db!: IDBDatabase;
  private initReady: Promise<void>;

  constructor() {
    this.initReady = this.initDB();
  }

  private initDB(): Promise<void> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, 1);

      request.onupgradeneeded = () => {
        const db = request.result;
        if (!db.objectStoreNames.contains(this.storeName)) {
          db.createObjectStore(this.storeName, {
            keyPath: 'id',
            autoIncrement: true,
          });
        }
      };

      request.onsuccess = () => {
        this.db = request.result;
        console.log('[IndexedDB] Database initialized successfully');
        resolve();
      };

      request.onerror = () => {
        console.error('[IndexedDB] Error initializing database:', request.error);
        reject(request.error);
      };
    });
  }

  async addData(data: any): Promise<void> {
    await this.initReady;

    // Mélymásolat, hogy biztosan eltávolítható legyen az id
    const dataToAdd = JSON.parse(JSON.stringify(data));

    // Töröljük az 'id' mezőt, így az IndexedDB automatikusan generálja
    if ('id' in dataToAdd) {
      delete dataToAdd.id;
    }

    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction(this.storeName, 'readwrite');
      const store = transaction.objectStore(this.storeName);

      const request = store.add(dataToAdd);

      request.onsuccess = () => {
        console.log('[IndexedDB] Adat sikeresen hozzáadva');
        resolve();
      };

      request.onerror = (event) => {
        console.error('[IndexedDB] Hiba hozzáadáskor:', event);
        reject(event);
      };
    });
  }

  async getAllData(): Promise<any[]> {
    await this.initReady;
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction(this.storeName, 'readonly');
      const store = transaction.objectStore(this.storeName);
      const request = store.getAll();
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  async updateData(data: any): Promise<void> {
    await this.initReady;
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction(this.storeName, 'readwrite');
      const store = transaction.objectStore(this.storeName);
      const request = store.put(data);
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  async deleteData(id: number): Promise<void> {
    await this.initReady;
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction(this.storeName, 'readwrite');
      const store = transaction.objectStore(this.storeName);
      const request = store.delete(id);
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }
}
