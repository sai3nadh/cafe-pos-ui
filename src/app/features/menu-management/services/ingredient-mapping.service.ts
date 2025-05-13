import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';


@Injectable({
  providedIn: 'root'
})
export class IngredientMappingService {

  private baseUrl = `${environment.apiUrl}/menu-items`;

    // private baseUrl = `${environment.apiUrl}/printer`;  // adjust if your backend API path is different
  
  constructor(private http: HttpClient) { }

  getAllMenuItemsWithIngredients(): Observable<any[]> {
    // return this.http.get<any[]>('http://localhost:8083/api/menu-items/ingredients/all');
    return this.http.get<any[]>(`${this.baseUrl}/ingredients/all`);
  }

  getMenuItemIngredientMapping(menuItemId: number): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/${menuItemId}/ingredients`);
  }


  // updateMapping(menuItemId: number, menuIngrId: number, quantity: number, unit: string): Observable<any> {
  //   return this.http.put(`${this.baseUrl}/${menuItemId}/ingredients/${menuIngrId}`, {
  //     quantity,
  //     unit
  //   });
  // }
 
  updateMapping(menuItemId: number, menuIngrId: number, quantity: number, unit: string): Observable<any> {
    return this.http.put(
      `${this.baseUrl}/${menuItemId}/ingredients/${menuIngrId}`,
      null, // no body
      {
        params: {
          quantity: quantity.toString(),
          unit: unit
        }
      }
    );
  }
  
  addMapping(menuItemId: number, ingredientId: number, quantity: number, unit: string): Observable<any> {
    return this.http.post(`${this.baseUrl}/${menuItemId}/ingredients`, null, {
      params: {
        ingredientId: ingredientId.toString(),
        quantity: quantity.toString(),
        unit
      }
    });
  }
  
  deleteMapping(menuIngrId: number): Observable<any> {
    // return this.http.delete(`${this.baseUrl}/1/ingredients/${menuIngrId}`); // menuItemId is ignored by backend
    return this.http.delete(`${this.baseUrl}/ingredients/${menuIngrId}`); // menuItemId is ignored by backend
  }
  
    
}
