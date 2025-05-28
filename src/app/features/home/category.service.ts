import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ApiCategory, MenuItemAvailability } from '../user/user.component';

// Define an interface that represents the category data from your API.
// export interface ApiCategory {
//   categoryId: number;
//   name: string;
//   version: number;
//   menuItems: any[]; // You can create a more specific interface if needed
// }

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  // Assuming your environment.apiUrl is set to something like 'http://localhost:8083/api'
  private apiUrl = `${environment.apiUrl}/categories`;
  private baseUrl = `${environment.apiUrl}/menu-items`;

  constructor(private http: HttpClient) {}

  // Method to load categories from the API
  loadCategories(): Observable<ApiCategory[]> {
    return this.http.get<ApiCategory[]>(this.apiUrl);
  }

   getAvailability(): Observable<MenuItemAvailability[]> {
    return this.http.get<MenuItemAvailability[]>(`${this.baseUrl}/max-available`);
  }
}
