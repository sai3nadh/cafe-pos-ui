import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class RegisterService {
  // private apiUrl = 'http://localhost:8083/api/auth/register';  // Endpoint for user registration
  private apiUrl = `${environment.apiUrl}/auth/register`;
  private rolesUrl = `${environment.apiUrl}/roles`;
  constructor(private http: HttpClient) {}

  // Register user by sending user data to the backend
  register(username: string, password: string, roleId: number): Observable<any> {
    const registrationData = { username, password, roleId };
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    return this.http.post(this.apiUrl, registrationData, { headers });
  }

  
  getRoles(): Observable<any[]> {
    return this.http.get<any[]>(this.rolesUrl);
  }
}
