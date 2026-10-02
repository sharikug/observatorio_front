import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { AuthResponse, LoginRequest, RegistroRequest } from '../models/auth.models';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private apiUrl = 'http://localhost:8080/api/auth';
  private currentUserSubject = new BehaviorSubject<string | null>(localStorage.getItem('name'));
  currentUser$ = this.currentUserSubject.asObservable();

  constructor(private http: HttpClient) {}

  login(data: LoginRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/login`, data);
  }

  registro(data: RegistroRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/registro`, data);
  }

  setSession(response: AuthResponse): void {
    localStorage.setItem('token', response.token);
    localStorage.setItem('name', response.name);
    localStorage.setItem('rol', response.rol);
    this.currentUserSubject.next(response.name);
  }

  /**
   * El token es sin estado: no hay nada que revocar en el backend, asi que cerrar
   * sesion es borrar lo guardado en el navegador.
   */
  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('name');
    localStorage.removeItem('rol');
    this.currentUserSubject.next(null);
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('token');
  }

  getRol(): string | null {
    return localStorage.getItem('rol');
  }
}