import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
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

  // Stato dell'utente corrente
  private userSubject = new BehaviorSubject<User | null>(null);
  public user$ = this.userSubject.asObservable();

  private api = 'http://localhost:8080/utenti';

  constructor(
    private http: HttpClient, 
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object // Identifica la piattaforma (Server o Browser)
  ) {
    this.hydrateUser();
  }

  // Restituisce true se il codice è in esecuzione nel browser
  private isBrowser(): boolean {
    return isPlatformBrowser(this.platformId);
  }

  // Ripristina la sessione dal localStorage all'avvio
  private hydrateUser() {
    if (this.isBrowser()) {
      const stored = localStorage.getItem('user');
      if (stored) {
        try {
          this.userSubject.next(JSON.parse(stored));
        } catch (e) {
          localStorage.removeItem('user');
        }
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
        if (this.isBrowser() && user) {
          localStorage.setItem('user', JSON.stringify(user));
        }
        this.userSubject.next(user);
      })
    );
  }

  // Logout e pulizia dati locali
  logout(): void {
    if (this.isBrowser()) {
      localStorage.removeItem('user');
    }
    this.userSubject.next(null);
    this.router.navigate(['/']);
  }

  // Controllo rapido stato autenticazione
  isLoggedIn(): boolean {
    return !!this.userSubject.value;
  }

  // Ritorna l'utente attualmente loggato
  getCurrentUser(): User | null {
    return this.userSubject.value;
  }
}