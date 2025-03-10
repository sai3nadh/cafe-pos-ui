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
  kitchen: boolean;
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
  private apiUrlEdit = `${environment.apiUrl}/orders/editOrderWithItems`;
  private apiUrlGet = `${environment.apiUrl}/orders/orders/user/`;
  private apiUrlCompleteOrder = `${environment.apiUrl}/orders`;  // Base URL for complete order endpoint
  private apiUrlPrintOrder = `http://192.168.0.4:8083/orders/printOrder`;  // Base URL for complete order endpoint

  constructor(private http: HttpClient) {}

  // Method to create an order with items
  createOrder(orderData: any): Observable<any> {
    return this.http.post(this.apiUrlCreate, orderData);
  }

  // Method to create an order with items
  editOrder(orderData: any): Observable<any> {
    return this.http.post(this.apiUrlEdit, orderData);
  }

  getOrdersForUserToday(userId: number): Observable<OrderDto[]> {
    return this.http.get<OrderDto[]>(this.apiUrlGet+userId+"/today");
  }

   // Method to complete an order by ID
   completeOrder(orderId: number): Observable<any> {
    // Make a PUT request to complete the order
    return this.http.put(`${this.apiUrlCompleteOrder}/${orderId}/complete`, {});
  }
  // ✅ New method to print order
  printOrder(orderId: number): Observable<any> {
    console.log(`${this.apiUrlPrintOrder}/${orderId}`);
    return this.http.post(`${this.apiUrlPrintOrder}/${orderId}`, {});
  }
}
