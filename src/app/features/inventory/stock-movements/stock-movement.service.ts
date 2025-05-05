import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { StockMovement } from './stock-movement.model';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class StockMovementService {
//   private apiUrl = '/api/stock-movements';
 private apiUrl = `${environment.apiUrl}/stock-movements`;
 
 private adjustApiUrl = `${environment.apiUrl}/stock-movements`;

  constructor(private http: HttpClient) {}

  getAll(): Observable<StockMovement[]> {
    return this.http.get<StockMovement[]>(this.apiUrl);
  }

  addMovement(data: Partial<StockMovement>): Observable<StockMovement> {
    return this.http.post<StockMovement>(this.adjustApiUrl, data);
  }
}
