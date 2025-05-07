import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PrinterService {

  private baseUrl = `${environment.apiUrl}/printer`;  // adjust if your backend API path is different

  constructor(private http: HttpClient) {}

  // ✅ Get the current printer enabled/disabled status
  getPrinterStatus(): Observable<boolean> {
    return this.http.get<boolean>(`${this.baseUrl}/status`);
  }

//   // ✅ Set the printer status (enabled/disabled)
//   setPrinterStatus(enabled: boolean): Observable<void> {
//     return this.http.post<void>(`${this.baseUrl}/status`, enabled);
//   }
  // ✅ Set the printer status (enabled/disabled)
setPrinterStatus(enabled: boolean): Observable<{ success: boolean; message: string; newStatus?: boolean }> {
    return this.http.post<{ success: boolean; message: string; newStatus?: boolean }>(
      `${this.baseUrl}/status`,
      enabled
    );
  }
  

  // ✅ (Optional) If you want to later use IP and port changing from frontend
  getReceiptPrinterIp(): Observable<string> {
    return this.http.get<string>(`${this.baseUrl}/receipt-ip`);
  }

  setReceiptPrinterIp(ip: string): Observable<void> {
    return this.http.post<void>(`${this.baseUrl}/receipt-ip`, ip);
  }

  getKitchenPrinterIp(): Observable<string> {
    return this.http.get<string>(`${this.baseUrl}/kitchen-ip`);
  }

  setKitchenPrinterIp(ip: string): Observable<void> {
    return this.http.post<void>(`${this.baseUrl}/kitchen-ip`, ip);
  }

  setReceiptPrinterPort(port: number): Observable<void> {
    return this.http.post<void>(`${this.baseUrl}/receipt-port`, port);
  }

}
