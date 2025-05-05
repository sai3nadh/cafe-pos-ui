import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Supplier } from '../models/supplier.model';
import { environment } from '../../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class SupplierService {
//   private apiUrl = 'http://localhost:8080/api/suppliers';    
    private apiUrl = `${environment.apiUrl}/suppliers`;
  constructor(private http: HttpClient) {}

  getAllSuppliers(): Observable<Supplier[]> {
    return this.http.get<Supplier[]>(this.apiUrl);
  }

  getSupplierById(id: number): Observable<Supplier> {
    return this.http.get<Supplier>(`${this.apiUrl}/${id}`);
  }

  createSupplier(supplier: any): Observable<Supplier> {
    return this.http.post<Supplier>(this.apiUrl, supplier);
  }
  
  updateSupplier(id: number, supplier: any): Observable<Supplier> {
    return this.http.put<Supplier>(`${this.apiUrl}/${id}`, supplier);
  }
  

  // ✅ Get recent purchases
getSupplierPurchases(id: number, page: number = 0, size: number = 10): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}/purchases?page=${page}&size=${size}`);
  }
  
  // ✅ Get full ledger
  getSupplierLedger(id: number, page: number = 0, size: number = 30): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/${id}/ledger?page=${page}&size=${size}`);
  }
  
  getSupplierPurchaseSummary(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}/purchases/summary`);
  }
  
  
}
