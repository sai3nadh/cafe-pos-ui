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
