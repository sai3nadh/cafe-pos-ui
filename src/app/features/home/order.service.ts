import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
export interface OrderItemDto {
  id: number;         // Unique identifier for the menu item
  name: string;       // Name of the menu item (e.g., "Coffee", "Tea")
  price: number;      // Price of the menu item
  category: number;   // Category id or code
  qty: number;        // Quantity ordered
}

export interface OrderDto {
  id: number;               // Unique order id
  time: string;             // Formatted order time (e.g., "10:00 AM")
  status: string;           // Order status (e.g., "Pending", "Completed", etc.)
  orderNumber: string;      // Order number (e.g., "110220251001")
  total: number;            // Total cost of the order
  items: OrderItemDto[];    // List of items in the order
}

@Injectable({
  providedIn: 'root'
})
export class OrderService {


  private apiUrlCreate = `${environment.apiUrl}/orders/createOrderWithItems`;
  private apiUrlGet = `${environment.apiUrl}/orders/orders/user/`;

  constructor(private http: HttpClient) {}

  // Method to create an order with items
  createOrder(orderData: any): Observable<any> {
    return this.http.post(this.apiUrlCreate, orderData);
  }

  getOrdersForUserToday(userId: number): Observable<OrderDto[]> {
    return this.http.get<OrderDto[]>(this.apiUrlGet+userId+"/today");
  }
}
