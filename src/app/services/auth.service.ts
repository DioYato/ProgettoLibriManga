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
  immagineProfilo?: string;
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
    // Ricarica utente dal localStorage
    const stored = localStorage.getItem('user');
    if (stored) {
      this._user.set(JSON.parse(stored));
    }
  }

  // Registrazione nuovo utente
  register(data: any): Observable<any> {
    return this.http.post(`${this.api}/create`, data);
  }

  login(credentials: { email: string; password: string }): Observable<User> {
    return this.http.post<User>(`${this.api}/login`, credentials).pipe(
      tap((user) => {
        this._user.set(user);

        // Memorizza utente autenticato
        localStorage.setItem('user', JSON.stringify(user));
      })
    );
  }

  logout(): void {
    this._user.set(undefined);
    localStorage.removeItem('user'); 
    this.router.navigate(['/']);
  }

  sendResetEmail(email: string) {
    return this.http.post('http://localhost:8080/auth/reset-password', { email });
  }
}
