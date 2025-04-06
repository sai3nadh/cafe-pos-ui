import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { MenuItem } from './edit-menu.component';
import { Category } from './edit-menu.component';

@Injectable({
  providedIn: 'root'
})
export class EditMenuService {

  private apiUrl = `${environment.apiUrl}/categories`; 
  //  'http://localhost:8083/api/categories';

  constructor(private http: HttpClient) { }

  createCategory(categoryData: any): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });
  
    console.log("Called create category API: " + this.apiUrl);
  
    // Assuming you're sending the category name as a query parameter
    // Adjust the URL as needed for your backend API (adding the 'name' as a query parameter)
    return this.http.post(this.apiUrl + '?name=' + encodeURIComponent(categoryData.name), {}, { headers });
  }
  
   // Update an existing menu item
   updateMenuItem(item: MenuItem): Observable<MenuItem> {
    return this.http.put<MenuItem>(`/api/menuItems/${item.menuItemId}`, item);
  }


  getCategories() {
    return this.http.get<Category[]>(this.apiUrl);
  }
  
  updateCategory(categoryId: number, name: string) {
    const params = new HttpParams().set('name', name);
    // return this.http.put(this.apiUrl+`/api/categories/${categoryId}`, {}, { params });
    return this.http.put(this.apiUrl+`/${categoryId}`, {}, { params });
  }

  // Create a new menu item
  createMenuItem(categoryId: number, item: MenuItem): Observable<MenuItem> {
    return this.http.post<MenuItem>(`/api/categories/${categoryId}/menuItems`, item);
  }
}
