import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, tap } from 'rxjs';
import { Router } from '@angular/router';

export interface User {
  id: number;
  email: string;
  nome: string;
  cognome: string;
  ruolo: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {

  private userSubject = new BehaviorSubject<User | null>(null);
  public user$ = this.userSubject.asObservable();

  private api = 'http://localhost:8080/utenti';

  private isBrowser(): boolean {
    return typeof window !== 'undefined';
  }

  constructor(private http: HttpClient, private router: Router) {
    if (this.isBrowser()) {
      const stored = localStorage.getItem('user');
      if (stored) {
        this.userSubject.next(JSON.parse(stored));
      }
    }
  }

  register(data: any) {
    return this.http.post(`${this.api}/create`, data);
  }

  login(credentials: { email: string; password: string }) {
    return this.http.post<User>(`${this.api}/login`, credentials).pipe(
      tap((user) => {
        if (this.isBrowser()) {
          localStorage.setItem('userId', String(user.id));
          localStorage.setItem('user', JSON.stringify(user));
        }
        this.userSubject.next(user);
      })
    );
  }

  logout() {
    if (this.isBrowser()) {
      localStorage.removeItem('userId');
      localStorage.removeItem('user');
    }

    this.userSubject.next(null);
    this.router.navigate(['/']);
  }

  isLoggedIn(): boolean {
    if (!this.isBrowser()) return false;
    return localStorage.getItem('userId') !== null;
  }
}

