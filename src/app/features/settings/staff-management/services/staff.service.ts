import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { StaffRegisterPayload,  StaffUpdatePayload } from '../models/user.model';
import { environment } from '../../../../../environments/environment';
import { Staff, StaffUpdateDTO } from '../models/staff.model';

@Injectable({
  providedIn: 'root',
})
export class StaffService {
  private apiStaffUrl = `${environment.apiUrl}/auth/register/staff`;
  private baseUrl = `${environment.apiUrl}/staff`;

  constructor(private http: HttpClient) {}

  registerStaff(payload: StaffRegisterPayload): Observable<any> {
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    return this.http.post(this.apiStaffUrl, payload, { headers });
  }

//   updateStaff(payload: StaffRegisterPayload): Observable<any> {
//     const headers = new HttpHeaders().set('Content-Type', 'application/json');
//     return this.http.put(`${this.apiStaffUrl}/update`, payload, { headers }); // Adjust endpoint!
//   }
  getStaffById(id: string): Observable<StaffRegisterPayload> {
    return this.http.get<StaffRegisterPayload>(`${this.baseUrl}/${id}/edit`);
    // return this.http.get<StaffRegisterPayload>(`${this.apiStaffUrl}/${id}`);
  }

getStaffDetailsById(id: string): Observable<Staff> {
  return this.http.get<Staff>(`${this.baseUrl}/${id}`);
}

//   updateStaff(id: string, payload: StaffRegisterPayload): Observable<any> {
//     return this.http.put(`${this.apiStaffUrl}/${id}`, payload, {
//       headers: new HttpHeaders().set('Content-Type', 'application/json')
//     });
//   }

//   updateStaff(id: string, payload: StaffUpdateDTO): Observable<Staff> {
//     return this.http.put<Staff>(`${this.baseUrl}/${id}`, payload);
//   }
//   updateStaff(id: string, payload: StaffUpdatePayload): Observable<Staff> {
//     return this.http.put<Staff>(`${this.baseUrl}/${id}`, payload);
//   }
  
  updateStaff(id: string, payload: StaffUpdateDTO): Observable<Staff> {
    return this.http.put<Staff>(`${this.baseUrl}/${id}`, payload);
  }
  
  getStaffList(): Observable<Staff[]> {
    return this.http.get<Staff[]>(this.baseUrl);
  }

  
}
