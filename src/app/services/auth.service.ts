import { HttpClient } from '@angular/common/http';
import { Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';
import { FavoritesService } from './favorites.service';

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

  public readonly user = signal<User | undefined>(undefined);

  private api = 'http://localhost:8080/utenti';

  constructor(
    private http: HttpClient,
    private router: Router,
    private favorites: FavoritesService,
  ) {
    // Ricarica utente dal localStorage
    const stored = localStorage.getItem('user');
    if (stored) {
      this.user.set(JSON.parse(stored));
    }
  }

  // Registrazione nuovo utente
  register(data: any): Observable<any> {
    return this.http.post(`${this.api}/create`, data);
  }

  login(credentials: { email: string; password: string }): Observable<User> {
    return this.http.post<User>(`${this.api}/login`, credentials).pipe(
      tap((user) => {
        this.user.set(user);

        // Memorizza utente autenticato
        localStorage.setItem('user', JSON.stringify(user));

        // Aggiorna i preferiti al login
        this.favorites.loadFromBackend().subscribe();
      })
    );
  }

  logout(): void {
    const currentUser = this.user();
    this.user.set(undefined);
    localStorage.removeItem('user');
    this.favorites.clearLocalFavorites(currentUser?.id);
    this.router.navigate(['/']);
  }

  sendResetEmail(email: string) {
    return this.http.post('http://localhost:8080/auth/reset-password', { email });
  }
}
