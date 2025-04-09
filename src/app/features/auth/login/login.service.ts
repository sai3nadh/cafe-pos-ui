import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { UserProfile } from './login.component';


@Injectable({
  providedIn: 'root'
})
export class LoginService {
  
    // private loginUrl = ;

  private apiUrl = `${environment.apiUrl}/auth/login`;
  private baseUrl = `${environment.apiUrl}/auth`;
  // 'http://localhost:8083/api/auth/login'; // API URL for login

  constructor(private http: HttpClient) {}

  login(username: string, password: string): Observable<any> {
    const url = `${this.apiUrl}?username=${username}&password=${password}`;  // Add query parameters
    const headers = new HttpHeaders().set('Accept', 'application/json');
    return this.http.post(url, {}, { headers });
  }

  getProfiles(): Observable<UserProfile[]> {
    return this.http.get<UserProfile[]>(`${this.baseUrl}/profiles`);
  }

  // loginWithPin(userId: number, pin: string): Observable<any> {
  //   return this.http.post(`${this.baseUrl}/pin-login`, { userId, pin });
  // }
  loginWithPin(userName: string, pin: string): Observable<any> {
    return this.http.post(`${this.baseUrl}/pin-login-user`, { userName, pin });
  }
  
}
