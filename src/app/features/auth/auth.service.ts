import { Injectable } from '@angular/core';
import { StorageService } from '../services/storage.service';

@Injectable({ providedIn: 'root' })
export class AuthService {
  constructor(private storage: StorageService) {}

  getRole(): string {
    return this.storage.getLocalVariable('role');
  }

  hasRole(role: string): boolean {
    return this.getRole() === role;
  }

  hasAnyRole(roles: string[]): boolean {
    return roles.includes(this.getRole());
  }

  isLoggedIn(): boolean {
    // return !!this.storage.getLocalVariable('userId');
    
    return !!this.storage.getLocal<string>('authToken');
  }
}
