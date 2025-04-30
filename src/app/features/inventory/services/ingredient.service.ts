import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Ingredient } from '../models/ingredient.model';
import { environment } from '../../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class IngredientService {
//   private apiUrl = 'http://localhost:8080/api/ingredients';

    private apiUrl = `${environment.apiUrl}/ingredients`;

  constructor(private http: HttpClient) {}

  getAllIngredients(): Observable<Ingredient[]> {
    return this.http.get<Ingredient[]>(this.apiUrl);
  }
}
