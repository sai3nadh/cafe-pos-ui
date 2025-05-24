// src/app/interceptors/auth.interceptor.ts
import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { StorageService } from '../features/services/storage.service';

// export const authInterceptor: HttpInterceptorFn = (req, next) => {
//   const token = localStorage.getItem('authToken');
// //   'eyJhbGciOiJIUzI1NiJ9.eyJyb2xlIjoiQURNSU4iLCJzdWIiOiJhYmMiLCJpYXQiOjE3NDc5NTkwMTIsImV4cCI6MTc0ODA0NTQxMn0.z3AGh7qolX-R5QHOi5mutaRWHduCmWyHT3VtaRrNFCI';
// //    localStorage.getItem('jwt');

//   if (token) {
//     const cloned = req.clone({
//       headers: req.headers.set('Authorization', `Bearer ${token}`)
//     });
//     console.log(cloned);
//       console.log('Intercepted request:', req.url);
// console.log('JWT Token:', token);
// console.log('Authorization Header:', req.headers.get('Authorization'));
// console.log('Modified Request Headers:', cloned.headers);

//     return next(cloned);
//   }
//   console.log('Intercepted request:', req.url);

//   return next(req);
// };


export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);
    const storageService = inject(StorageService);

  const token = storageService.getLocal<string>('authToken');

  const excludedUrls = ['/login', '/register', '/public'];

    const shouldSkip = excludedUrls.some(url => req.url.includes(url));

    if (shouldSkip) {
    return next(req); // 🔁 Skip token
    }

  const authReq = token
    ? req.clone({
        headers: req.headers.set('Authorization', `Bearer ${token}`)
      })
    : req;

  return next(authReq).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401) {
        console.warn('401 detected. Logging out...');
        localStorage.clear(); // or use your StorageService
        router.navigate(['/login']);
      }
      return throwError(() => error);
    })
  );
};