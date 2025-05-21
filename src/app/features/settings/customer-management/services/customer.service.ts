import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CustomerData, CustomerList } from '../models/customer.model';
import { Observable } from 'rxjs';
import { environment } from '../../../../../environments/environment';
// import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class CustomerService {
//   private baseUrl = 'http://localhost:8083/api/customers';
  private baseUrl = `${environment.apiUrl}/customers`;
    // private apiUrl = `${environment.apiUrl}/suppliers`;

  constructor(private http: HttpClient) {}

  getCustomerList(): Observable<CustomerList[]> {
    return this.http.get<CustomerList[]>(`${this.baseUrl}/list`);
  }


  getCustomerById(id: string): Observable<CustomerData> {
    return this.http.get<CustomerData>(`${this.baseUrl}/${id}`);
  }


  addCustomer(customerData: FormData): Observable<any> {
    return this.http.post(`${this.baseUrl}/create`, customerData);
  }
  
  updateCustomer(id: string, customerData: FormData): Observable<any> {
    return this.http.put(`${this.baseUrl}/${id}`, customerData);
  }
  
//   getCustomerById(id: string): Observable<CustomerData> {
//     return this.http.get<CustomerData>(`${this.apiUrl}/${id}`);
//   }
  
  
}
