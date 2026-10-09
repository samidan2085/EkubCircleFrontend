import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  fullName?: string;
  role?: string;
}

export interface AuthResponse {
  token: string;
  role: string;
  email: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly http = inject(HttpClient);

  private readonly apiUrl = 'http://localhost:5034/api/auth';

  private readonly tokenKey = 'accessToken';
  private readonly roleKey = 'userRole';
  private readonly emailKey = 'userEmail';

  // Login existing Organizer or Member
  login(credentials: LoginRequest): Observable<AuthResponse> {
    return this.http
      .post<AuthResponse>(
        `${this.apiUrl}/login`,
        credentials
      )
      .pipe(
        tap(response => {
          this.saveSession(response);
        })
      );
  }

  // Register a user
  registerUser(
    userData: RegisterRequest
  ): Observable<AuthResponse> {
    return this.http
      .post<AuthResponse>(
        `${this.apiUrl}/register`,
        userData
      )
      .pipe(
        tap(response => {
          if (response.token) {
            this.saveSession(response);
          }
        })
      );
  }

  // Store authentication details for this browser tab
  private saveSession(response: AuthResponse): void {
    sessionStorage.setItem(
      this.tokenKey,
      response.token
    );

    sessionStorage.setItem(
      this.roleKey,
      response.role
    );

    sessionStorage.setItem(
      this.emailKey,
      response.email
    );
  }

  // Logout current user in this tab
  logout(): void {
    sessionStorage.removeItem(this.tokenKey);
    sessionStorage.removeItem(this.roleKey);
    sessionStorage.removeItem(this.emailKey);
  }

  // Get current access token
  getToken(): string | null {
    return sessionStorage.getItem(this.tokenKey);
  }

  // Get current user's role
  getRole(): string | null {
    return sessionStorage.getItem(this.roleKey);
  }

  // Get current user's email
  getEmail(): string | null {
    return sessionStorage.getItem(this.emailKey);
  }

  // Check whether a token exists
  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  // Check whether the current user is an Organizer
  isOrganizer(): boolean {
    return this.getRole()?.toLowerCase() === 'organizer';
  }

  // Check whether the current user is a Member
  isMember(): boolean {
    return this.getRole()?.toLowerCase() === 'member';
  }

  // Check a role dynamically
  hasRole(role: string): boolean {
    return this.getRole()?.toLowerCase() === role.toLowerCase();
  }
}