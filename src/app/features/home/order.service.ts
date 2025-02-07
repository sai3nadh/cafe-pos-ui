import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class OrderService {

  private apiUrl = 'http://localhost:8083'+'/api/orders/createOrderWithItems'; // Your API endpoint

  constructor(private http: HttpClient) {}

  // Method to create an order with items
  createOrder(orderData: any): Observable<any> {
    return this.http.post(this.apiUrl, orderData);
  }
}
