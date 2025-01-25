import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClientModule } from '@angular/common/http';  // <-- Add this import


@Injectable({
  providedIn: 'root'
})
export class LoginService {
  private apiUrl = 'http://localhost:8083/api/auth/login'; // API URL for login

  constructor(private http: HttpClient) {}

  // Method to authenticate the user
  // login(username: string, password: string): Observable<any> {
  //   const url = `${this.apiUrl}?username=${username}&password=${password}`;
  //   const headers = new HttpHeaders().set('Accept', '*/*');
  //   return this.http.post(url, {}, { headers });
  // }



  // Method to authenticate the user
  login(username: string, password: string): Observable<any> {
    const url = `${this.apiUrl}?username=${username}&password=${password}`;
    const headers = new HttpHeaders().set('Accept', '*/*');
    return this.http.post(url, {}, { headers });
  }
}
