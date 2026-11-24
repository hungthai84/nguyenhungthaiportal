import { WallpaperPreset } from '@/data/wallpapers';

const DB_NAME = 'HungThaiWallpaperDB';
const DB_VERSION = 1;
const STORE_NAME = 'custom_wallpapers';
const ACTIVE_STORE_NAME = 'active_wallpaper';

function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined' || !window.indexedDB) {
      reject(new Error('IndexedDB is not supported in this environment'));
      return;
    }

    const request = window.indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'id' });
      }
      if (!db.objectStoreNames.contains(ACTIVE_STORE_NAME)) {
        db.createObjectStore(ACTIVE_STORE_NAME, { keyPath: 'key' });
      }
    };

    request.onsuccess = () => {
      resolve(request.result);
    };

    request.onerror = () => {
      reject(request.error);
    };
  });
}

export async function saveCustomWallpaperToDB(wp: WallpaperPreset): Promise<void> {
  try {
    const db = await openDB();
    const tx = db.transaction(STORE_NAME, 'readwrite');
    const store = tx.objectStore(STORE_NAME);
    store.put(wp);
    return new Promise((resolve, reject) => {
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    });
  } catch (err) {
    console.warn('Failed to save wallpaper to IndexedDB:', err);
  }
}

export async function getAllCustomWallpapersFromDB(): Promise<WallpaperPreset[]> {
  try {
    const db = await openDB();
    const tx = db.transaction(STORE_NAME, 'readonly');
    const store = tx.objectStore(STORE_NAME);
    const request = store.getAll();
    return new Promise((resolve, reject) => {
      request.onsuccess = () => resolve(request.result || []);
      request.onerror = () => reject(request.error);
    });
  } catch (err) {
    console.warn('Failed to read wallpapers from IndexedDB:', err);
    return [];
  }
}

export async function deleteCustomWallpaperFromDB(id: string): Promise<void> {
  try {
    const db = await openDB();
    const tx = db.transaction(STORE_NAME, 'readwrite');
    const store = tx.objectStore(STORE_NAME);
    store.delete(id);
    return new Promise((resolve, reject) => {
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    });
  } catch (err) {
    console.warn('Failed to delete wallpaper from IndexedDB:', err);
  }
}

export async function saveActiveWallpaperToDB(wp: WallpaperPreset): Promise<void> {
  try {
    const db = await openDB();
    const tx = db.transaction(ACTIVE_STORE_NAME, 'readwrite');
    const store = tx.objectStore(ACTIVE_STORE_NAME);
    store.put({ key: 'active', wp });
    return new Promise((resolve, reject) => {
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    });
  } catch (err) {
    console.warn('Failed to save active wallpaper to IndexedDB:', err);
  }
}

export async function getActiveWallpaperFromDB(): Promise<WallpaperPreset | null> {
  try {
    const db = await openDB();
    const tx = db.transaction(ACTIVE_STORE_NAME, 'readonly');
    const store = tx.objectStore(ACTIVE_STORE_NAME);
    const request = store.get('active');
    return new Promise((resolve, reject) => {
      request.onsuccess = () => resolve(request.result?.wp || null);
      request.onerror = () => reject(request.error);
    });
  } catch (err) {
    console.warn('Failed to get active wallpaper from IndexedDB:', err);
    return null;
  }
}
