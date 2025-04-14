import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { StaffRegisterPayload } from './register.component';
// import { UserRegistration } from './register.component';

@Injectable({
  providedIn: 'root'
})
export class RegisterService {
  // private apiUrl = 'http://localhost:8083/api/auth/register';  // Endpoint for user registration
  private apiUrl = `${environment.apiUrl}/auth/register`;
  private apiStaffUrl = `${environment.apiUrl}/auth/register/staff`;
  private rolesUrl = `${environment.apiUrl}/roles`;
  constructor(private http: HttpClient) {}

  // Register user by sending user data to the backend
  // registerOld(username: string, password: string, roleId: number): Observable<any> {
  //   const registrationData = { username, password, roleId };
  //   const headers = new HttpHeaders().set('Content-Type', 'application/json');
  //   return this.http.post(this.apiUrl, registrationData, { headers });
  // }


  register(userData: StaffRegisterPayload): Observable<any> {
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    return this.http.post(this.apiStaffUrl, userData, { headers });
  }
  // register(userData: {
  //   firstName: string;
  //   lastName: string;
  //   email: string;
  //   phoneNumber: string;
  //   username: string;
  //   password: string;
  //   accessPin: string;
  //   roleId: number;
  // }): Observable<any> {
  //   const headers = new HttpHeaders().set('Content-Type', 'application/json');
  //   return this.http.post(this.apiStaffUrl, userData, { headers });
  // }
  
  
  getRoles(): Observable<any[]> {
    return this.http.get<any[]>(this.rolesUrl);
  }
}
