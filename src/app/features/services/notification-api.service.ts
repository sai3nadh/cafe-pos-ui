import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class NotificationApiService {
  private readonly backendUrl = `${environment.apiUrl}`;
//   'http://localhost:8083'; // 🧠 change to IP on production
//  private apiUrl = `${environment.apiUrl}/customers/create`;

  constructor(private http: HttpClient) {}

  sendNotification(message: string) {
    return this.http.post(`${this.backendUrl}/notify`, message, {
      responseType: 'text'
    });
  }

   // 🟢 Order-related notification
   sendOrderEvent(orderInfo: string) {
    return this.http.post(`${this.backendUrl}/order-event`, orderInfo, {
      responseType: 'text'
    });
  }

  // 🔴 Kitchen update
  sendKitchenEvent(kitchenMessage: string) {
    return this.http.post(`${this.backendUrl}/kitchen-event`, kitchenMessage, {
      responseType: 'text'
    });
  }

    // 🟡 Order Display Screen Update
    sendOrderDisplayUpdate(orderDisplayData: string) {
      return this.http.post(`${this.backendUrl}/order-display`, orderDisplayData, {
        responseType: 'text'
      });
    }
  
}
