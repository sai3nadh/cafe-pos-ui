import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PurchasePaymentRequest, PurchaseRequest, PurchaseResponse } from '../models/purchase.model';
import { environment } from '../../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class PurchaseService {
//   private apiUrl = 'http://localhost:8080/api/purchases';
  private apiUrl = `${environment.apiUrl}/purchases`;

  constructor(private http: HttpClient) {}

  createPurchase(data: PurchaseRequest): Observable<any> {
    return this.http.post(this.apiUrl, data);
  }

  getAllPurchases(): Observable<PurchaseResponse[]> {
    return this.http.get<PurchaseResponse[]>(this.apiUrl);
  }

  getPurchaseById(id: number): Observable<PurchaseResponse> {
    return this.http.get<PurchaseResponse>(`${this.apiUrl}/${id}`);
  }
  

  addPayment(purchaseId: number, payment: PurchasePaymentRequest): Observable<any> {
    return this.http.post(`${this.apiUrl}/${purchaseId}/payments`, payment);
  }
  
//   addPayment(purchaseId: number, payment: { amount: number, paymentMethod: string, reference?: string }): Observable<any> {
//     return this.http.post(`${this.apiUrl}/${purchaseId}/payments`, payment);
//   }
  
}
