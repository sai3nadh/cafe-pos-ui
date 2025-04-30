import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PurchaseRequest } from '../models/purchase.model';
import { environment } from '../../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class PurchaseService {
//   private apiUrl = 'http://localhost:8080/api/purchases';
  private apiUrl = `${environment.apiUrl}/purchasewws`;

  constructor(private http: HttpClient) {}

  createPurchase(data: PurchaseRequest): Observable<any> {
    return this.http.post(this.apiUrl, data);
  }
}
