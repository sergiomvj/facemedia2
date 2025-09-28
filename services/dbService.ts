
import { StoredCreation } from '../types';

let db: IDBDatabase;
const DB_NAME = 'FaceMediaStudioDB_V2';
const STORE_NAME = 'creations';
const DB_VERSION = 1;

export const openDb = (): Promise<IDBDatabase> => {
  return new Promise((resolve, reject) => {
    if (db) {
      return resolve(db);
    }

    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onerror = () => {
      console.error('Error opening IndexedDB:', request.error);
      reject('Error opening IndexedDB');
    };

    request.onsuccess = () => {
      db = request.result;
      resolve(db);
    };

    request.onupgradeneeded = (event) => {
      const dbInstance = (event.target as IDBOpenDBRequest).result;
      if (!dbInstance.objectStoreNames.contains(STORE_NAME)) {
        dbInstance.createObjectStore(STORE_NAME, { keyPath: 'id', autoIncrement: true });
      }
    };
  });
};

export const addCreation = async (creation: Omit<StoredCreation, 'id'>): Promise<void> => {
  const db = await openDb();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(STORE_NAME, 'readwrite');
    const store = transaction.objectStore(STORE_NAME);
    const request = store.add(creation);

    request.onsuccess = () => resolve();
    request.onerror = () => {
      console.error('Error adding creation:', request.error);
      reject('Error adding creation');
    };
  });
};

export const getCreations = async (): Promise<StoredCreation[]> => {
  const db = await openDb();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(STORE_NAME, 'readonly');
    const store = transaction.objectStore(STORE_NAME);
    const request = store.getAll();

    request.onsuccess = () => {
        // Sort by timestamp descending to show newest first
        resolve(request.result.sort((a, b) => b.timestamp - a.timestamp));
    };
    request.onerror = () => {
      console.error('Error getting creations:', request.error);
      reject('Error getting creations');
    };
  });
};

export const deleteCreation = async (id: number): Promise<void> => {
  const db = await openDb();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(STORE_NAME, 'readwrite');
    const store = transaction.objectStore(STORE_NAME);
    const request = store.delete(id);

    request.onsuccess = () => resolve();
    request.onerror = () => {
      console.error('Error deleting creation:', request.error);
      reject('Error deleting creation');
    };
  });
};
