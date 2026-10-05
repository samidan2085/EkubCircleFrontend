import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { LoginRequest, ChangePasswordRequest } from '../models/user.models';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private http = inject(HttpClient);
  private apiUrl = 'https://localhost:5001/api/auth';

  login(credentials: LoginRequest): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/login`, credentials);
  }

  register(userData: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/register`, userData);
  }

  changePassword(data: ChangePasswordRequest): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/change-password`, data);
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('token');
  }

  mustChangePassword(): boolean {
    return localStorage.getItem('mustChangePassword') === 'true';
  }
}