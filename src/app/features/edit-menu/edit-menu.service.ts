import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EditMenuService {

  private apiUrl = 'http://localhost:8083/api/categories';

  constructor(private http: HttpClient) { }

  createCategory(categoryData: any): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });
  
    console.log("Called create category API: " + this.apiUrl);
  
    // Assuming you're sending the category name as a query parameter
    // Adjust the URL as needed for your backend API (adding the 'name' as a query parameter)
    return this.http.post(this.apiUrl + '?name=' + encodeURIComponent(categoryData.name), {}, { headers });
  }
  
}
