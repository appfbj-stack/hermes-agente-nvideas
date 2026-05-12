const DB_NAME = 'AgendaPastoralDB';
const DB_VERSION = 2; // Incrementado para forçar a criação de novas tabelas

export class LocalDB {
  private db: IDBDatabase | null = null;

  async init(): Promise<IDBDatabase> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, DB_VERSION);

      request.onupgradeneeded = (event: any) => {
        const db = event.target.result;
        const stores = [
          'members', 
          'services', 
          'patrimonio', 
          'pastoral_agenda', 
          'tasks', 
          'festivities',
          'sermons',
          'cells',
          'visits',
          'weddings',
          'counseling',
          'finance'
        ];
        
        stores.forEach(store => {
          if (!db.objectStoreNames.contains(store)) {
            db.createObjectStore(store, { keyPath: 'id' });
          }
        });
      };

      request.onsuccess = () => {
        this.db = request.result;
        resolve(request.result);
      };

      request.onerror = () => reject(request.error);
    });
  }

  private async getDB(): Promise<IDBDatabase> {
    if (this.db) return this.db;
    return await this.init();
  }

  async getAll<T>(storeName: string): Promise<T[]> {
    const db = await this.getDB();
    return new Promise((resolve, reject) => {
      try {
        const transaction = db.transaction(storeName, 'readonly');
        const store = transaction.objectStore(storeName);
        const request = store.getAll();
        request.onsuccess = () => resolve(request.result || []);
        request.onerror = () => reject(request.error);
      } catch (e) {
        // Se a store não existir, retorna array vazio em vez de travar
        console.warn(`Store ${storeName} não encontrada.`);
        resolve([]);
      }
    });
  }

  async saveAll<T extends { id: string }>(storeName: string, data: T[]): Promise<void> {
    const db = await this.getDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(storeName, 'readwrite');
      const store = transaction.objectStore(storeName);
      
      const clearRequest = store.clear();
      
      clearRequest.onsuccess = () => {
        data.forEach(item => {
           if (item && item.id) store.add(item);
        });
        transaction.oncomplete = () => resolve();
        transaction.onerror = () => reject(transaction.error);
      };
      
      clearRequest.onerror = () => reject(clearRequest.error);
    });
  }
}

export const localDb = new LocalDB();