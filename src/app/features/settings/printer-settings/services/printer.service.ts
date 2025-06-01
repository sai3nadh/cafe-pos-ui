import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PrinterConfig } from '../models/printer-config.model';
import { environment } from '../../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PrinterService {
//   private baseUrl = `${environment.apiUrl}/printer/config`;

//   constructor(private http: HttpClient) {}

//   getConfig(): Observable<PrinterConfig> {
//     return this.http.get<PrinterConfig>(this.baseUrl);
//   }

//   updateConfig(config: PrinterConfig): Observable<any> {
//     return this.http.put(this.baseUrl, config);
//   }
}

export class PrinterBridgeService {
    // PrinterBridgeService.printOrder(response);
    
  static isAndroid(): boolean {
    return typeof (window as any).AndroidPrint !== 'undefined';
  }

  static printOrder(order: any): void {
    if (this.isAndroid() && (window as any).AndroidPrint.printOrder) {
      (window as any).AndroidPrint.printOrder(JSON.stringify(order));
    } else {
      console.warn('Not running inside Android WebView. Printing skipped.');
    }
  }
}
