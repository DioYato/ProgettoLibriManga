import { HttpClient } from '@angular/common/http';
import { Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';

export interface User {
  id: number;
  email: string;
  nome: string;
  cognome: string;
  ruolo: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {

  private readonly _user = signal<User | undefined>(undefined);

  public readonly user = this._user.asReadonly();

  private api = 'http://localhost:8080/utenti';

  constructor(
    private http: HttpClient,
    private router: Router,
  ) {
    this.hydrateUser();
  }

  // Ripristina la sessione dal localStorage all'avvio
  private hydrateUser() {
    const stored = localStorage.getItem('user');
    if (stored) {
      try {
        this._user.set(JSON.parse(stored));
      } catch (e) {
        localStorage.removeItem('user');
      }
    }
  }

  // Registrazione nuovo utente
  register(data: any): Observable<any> {
    return this.http.post(`${this.api}/create`, data);
  }

  // Login utente e persistenza sessione
  login(credentials: { email: string; password: string }): Observable<User> {
    return this.http.post<User>(`${this.api}/login`, credentials).pipe(
      tap((user) => {
        localStorage.setItem('user', JSON.stringify(user));
        this._user.set(user);
      })
    );
  }

  // Logout e pulizia dati locali
  logout(): void {
    this._user.set(undefined)
    this.router.navigate(['/']);
  }

  sendResetEmail(email: string) {
    return this.http.post('http://localhost:8080/auth/reset-password', { email });
  }
}