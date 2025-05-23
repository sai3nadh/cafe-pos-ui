import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Customer, OrderSummary, PurchaseHistoryResponse, PurchaseRecord } from '../user/user.component';
import { map } from 'rxjs/operators';
import { StorageService } from '../services/storage.service';
import { Router } from '@angular/router';
import { DailySales, ReportDTO } from '../report/report.component';
import { ItemReadyResponse } from '../pending-orders/pending-orders.component';

export interface OrderItemDto {
  orderItemId?: number;
  id: number;         // Unique identifier for the menu item
  name: string;       // Name of the menu item (e.g., "Coffee", "Tea")
  price: number;      // Price of the menu item
  category: number;   // Category id or code
  qty: number;        // Quantity ordered
  kitchen: boolean;
  itemNote: string;
  itemStatus?: 'pending' | 'preparing' | 'ready' | 'delivered' | 'cancelled' | null;
  statusUpdated?: string; // ISO timestamp string
}

export interface OrderDto {
  id: number;               // Unique order id
  time: string;             // Formatted order time (e.g., "10:00 AM")
  status: string;           // Order status (e.g., "Pending", "Completed", etc.)
  orderNumber: string;      // Order number (e.g., "110220251001")
  total: number;            // Total cost of the order
  paidAmount : number;
  sittingArea: string;
  items: OrderItemDto[];    // List of items in the order
}

@Injectable({
  providedIn: 'root'
})
export class OrderService {


  private apiUrlCreate = `${environment.apiUrl}/orders/createOrderWithItems`;
  private apiUrlCreatePayment = `${environment.apiUrl}/orders/createOrderWithItemsPayment`;
  private apiUrlUpdatePayment = `${environment.apiUrl}/payments/payPendingAmt`;
  private apiUrlUpdateAllPayments = `${environment.apiUrl}/payments/payMultiplePendingAmts`;
  private apiUrlEdit = `${environment.apiUrl}/orders/editOrderWithItems`;
  private apiUrlGet = `${environment.apiUrl}/orders/orders/user/`;
  private apiUrlCompleteOrder = `${environment.apiUrl}/orders`;  // Base URL for complete order endpoint
  private apiUrlPrintOrder = `http://192.168.0.4:8083/orders/printOrder`;  // Base URL for complete order endpoint
  private apiUrlGetCustomers = `${environment.apiUrl}/customers`; // Change this to your actual API endpoint
  private url = `${environment.apiUrl}/orders/printOrder/`;
  private undpaidOrders = `${environment.apiUrl}/orders/orders/unpaid-grouped-by-customer`;
  private readonly reportUrl = `${environment.apiUrl}/reports`;
  

  constructor(private http: HttpClient
    , private storageService: StorageService
    ,private router: Router
  ) {}

  // Method to create an order with items
  createOrder(orderData: any): Observable<any> {
    return this.http.post(this.apiUrlCreate, orderData);
  }

    // Method to create an order with items
    createOrderPayment(orderData: any): Observable<any> {
      return this.http.post(this.apiUrlCreatePayment, orderData);
    }

    // Method to create an order with items
    updateOrderPayment(paymentData: any): Observable<any> {
      return this.http.post(this.apiUrlUpdatePayment, paymentData);
    }

    // order.service.ts
    updateMultipleOrderPayments(paymentDataList: any[]): Observable<any> {
      return this.http.post<any[]>(this.apiUrlUpdateAllPayments, paymentDataList);
    }

  
  // Method to create an order with items
  editOrder(orderData: any): Observable<any> {
    return this.http.post(this.apiUrlEdit, orderData);
  }

  // getOrdersForUserToday(userId: number): Observable<OrderDto[]> {
  //   return this.http.get<OrderDto[]>(this.apiUrlGet+userId+"/today");
  // }
  // this methods returns only orders specific to user. not all
  getOrdersForUserToday(userId: number): Observable<OrderDto[]> {
    return this.http.get<OrderDto[]>(this.apiUrlGet+userId+"/todayPayments");
  }

  getOrdersForUserTodayAll(userId: number): Observable<OrderDto[]> {
    return this.http.get<OrderDto[]>(this.apiUrlGet+userId+"/todayPayments/all");
  }

   // Method to complete an order by ID
   completeOrder(orderId: number): Observable<any> {
    // Make a PUT request to complete the order
    return this.http.put(`${this.apiUrlCompleteOrder}/${orderId}/complete`, {});
  }

  // Method to update the status of an order by ID
  updateOrderStatus(orderId: number, status: string): Observable<any> {
    // Make a PUT request to update the order status
    return this.http.put(`${this.apiUrlCompleteOrder}/${orderId}/status`, null, {
      params: { status }
    });
  }

   // Method to update the status of an order by ID
   deliverOrder(orderId: number): Observable<any> {
    // Make a PUT request to complete the order
    return this.http.put(`${this.apiUrlCompleteOrder}/${orderId}/deliver`, {});
  }

  // // ✅ New method to print order
  // printOrder(orderId: number): Observable<any> {
  //   console.log(`${this.apiUrlPrintOrder}/${orderId}`);
  //   return this.http.post(`${this.apiUrlPrintOrder}/${orderId}`, {});
  // }

  getCustomers(): Observable<{
    id: number; name: string; avatar: string 
}[]> {
    return this.http.get<Customer[]>(this.apiUrlGetCustomers).pipe(
      map(customers =>
        customers.map(customer => ({
          id: customer.customerId,
          name: customer.firstName,
          avatar: `data:image/png;base64,${customer.image}` // Convert Base64 to Data URL
        }))
      )
    );
  }

    // Method to reprint an order
  reprintOrder(orderId: number): Observable<any> {
    // const requestUrl = `${this.url}${orderId}/reprint`;  // Constructing the URL with orderId
    // alert("url"+requestUrl);
     let requestUrl = `${this.url}${orderId}/reprint`;

  // Remove '/api' if it's in the URL
  requestUrl = requestUrl.replace('/api', '');
    // alert("url"+requestUrl);

    return this.http.post<any>(requestUrl, {});  // Making the POST request with empty body
  }

  checkLogin(): boolean {
    const userId = this.storageService.getLocalVariable('userId');
    const username = this.storageService.getLocalVariable('username');

    if (!(userId && username)) {
      // If user data does not exist, redirect to login page
      this.router.navigate(['/login']);
      return false;
    }
    return true;
  }

     // Fetch purchase history from the API
  fetchPurchaseHistory(): Observable<{ [userId: number]: PurchaseRecord[] }> {
    return this.http.get<PurchaseHistoryResponse>(this.undpaidOrders).pipe(
      map((response) => {
        return response; // No transformation needed
      })
    );
  }


  // below method for report generation
  getSalesReport(from: string, to: string): Observable<ReportDTO> {
    const params = new HttpParams()
      .set('from', from)
      .set('to', to);

    return this.http.get<ReportDTO>(`${this.reportUrl}/sales`, { params });
  }

  //this method returns the daily sales grouped by date  
  getDailySales(fromDate: string, toDate: string): Observable<DailySales[]> {
    return this.http.get<DailySales[]>(
      `${this.reportUrl}/sales/daily?from=${fromDate}&to=${toDate}`
    );
  }

  getTodayOrders(): Observable<OrderSummary[]> {
    return this.http.get<OrderSummary[]>(`${this.apiUrlCompleteOrder}/summary-with-customer`);
  }

  markItemAsReady(orderItemId: number) {
    return this.http.put<ItemReadyResponse>(`${this.apiUrlCompleteOrder}/order-items/${orderItemId}/mark-ready`, {});
  }

  // for the display the orders
  getReadyOrdersToday(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrlCompleteOrder}/today/ready/display`);
  }
}
