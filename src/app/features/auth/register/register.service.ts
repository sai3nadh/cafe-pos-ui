import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RegisterService {
  private apiUrl = 'http://localhost:8083/api/auth/register';  // Endpoint for user registration

  constructor(private http: HttpClient) {}

  // Register user by sending user data to the backend
  register(username: string, password: string, roleId: number): Observable<any> {
    const registrationData = { username, password, roleId };
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    return this.http.post(this.apiUrl, registrationData, { headers });
  }
}
