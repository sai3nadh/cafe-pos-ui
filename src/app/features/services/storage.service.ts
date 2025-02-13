// import { Injectable } from '@angular/core';

// @Injectable({
//   providedIn: 'root'
// })
// export class StorageService {

//   constructor() { }
// }


import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class StorageService {

  private localVariable: any;

  isSessionStorageAvailable(): boolean {
    return typeof window !== 'undefined' && !!window.sessionStorage;
  }

  getSessionItem(key: string): string | null {
    if (this.isSessionStorageAvailable()) {
      // return sessionStorage.getItem(key);
    }
    console.error('Session storage is not available.');
    return null;
  }

  setSessionItem(key: string, value: string): void {
    if (this.isSessionStorageAvailable()) {
      // sessionStorage.setItem(key, value);
    } else {
      console.error('Session storage is not available.');
    }
  }

  removeSessionItem(key: string): void {
    if (this.isSessionStorageAvailable()) {
      // sessionStorage.removeItem(key);
    } else {
      console.error('Session storage is not available.');
    }
  }

  clearSession(): void {
    if (this.isSessionStorageAvailable()) {
      // sessionStorage.clear();
    } else {
      console.error('Session storage is not available.');
    }
  }

   // Store a local variable in localStorage
   setLocalVariable(key: string, value: any): void {
    this.localVariable = value; // Optional: store it in the service
    if (typeof window !== 'undefined' && !!window.localStorage) {
      localStorage.setItem(key, JSON.stringify(value));
    } else {
      console.error('Local storage is not available.');
    }
  }

  // Get the local variable from localStorage
  getLocalVariable(key: string): any {
    if (typeof window !== 'undefined' && !!window.localStorage) {
      const storedValue = localStorage.getItem(key);
      return storedValue ? JSON.parse(storedValue) : null;
    }
    console.error('Local storage is not available.');
    return null;
  }

  // Clear the local variable from localStorage
  clearLocalVariable(key: string): void {
    this.localVariable = null; // Optional: clear it from the service
    if (typeof window !== 'undefined' && !!window.localStorage) {
      localStorage.removeItem(key);
    } else {
      console.error('Local storage is not available.');
    }
  }
   // Clear all local variables from localStorage
   clearAllLocalVariables(): void {
    if (typeof window !== 'undefined' && !!window.localStorage) {
      localStorage.clear();
    } else {
      console.error('Local storage is not available.');
    }
  }
}


