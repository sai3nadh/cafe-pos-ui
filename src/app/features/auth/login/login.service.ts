import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class LoginService {
  
  private apiUrl = 'http://localhost:8083/api/auth/login'; // API URL for login

  constructor(private http: HttpClient) {}

  login(username: string, password: string): Observable<any> {
    const url = `${this.apiUrl}?username=${username}&password=${password}`;  // Add query parameters
    const headers = new HttpHeaders().set('Accept', 'application/json');
    return this.http.post(url, {}, { headers });
  }
}
