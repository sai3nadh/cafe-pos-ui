import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AddCustomerComponent } from './add-customer.component';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CustomerService {
//   private apiUrl = 'http://localhost:8083/api/customers/create';
  private apiUrl = `${environment.apiUrl}/customers/create`;

  constructor(private http: HttpClient) {}

  addCustomer(customerData: FormData): Observable<any> {
    return this.http.post<any>(this.apiUrl, customerData);
  }
}
