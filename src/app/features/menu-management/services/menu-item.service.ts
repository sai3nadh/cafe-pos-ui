import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { MenuItem } from '../models/menu-item.model';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class MenuItemService {
  // private baseUrl = 'http://localhost:8083/api/menu-items';
  private baseUrl = `${environment.apiUrl}/menu-items`;
  // private baseUrl = `${environment.apiUrl}/printer`;  // adjust if your backend API path is different

  constructor(private http: HttpClient) {}

  getMenuItemById(menuItemId: number): Observable<MenuItem> {
    return this.http.get<MenuItem>(`${this.baseUrl}/${menuItemId}`);
  }
}
