import { HttpClient } from '@angular/common/http';
import { Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';
import { FavoritesService } from './favorites.service';
import { User } from '../models/user.model';

@Injectable({ providedIn: 'root' })
export class AuthService {

  public readonly user = signal<User | undefined>(undefined);

  private api = 'http://localhost:8080/utenti';

  constructor(
    private http: HttpClient,
    private router: Router,
    private favorites: FavoritesService,
  ) {
    const stored = localStorage.getItem('user');
    if (stored) {
      this.user.set(JSON.parse(stored));
    }
  }

  register(data: Partial<User> & { password: string }): Observable<void> {
    return this.http.post<void>(`${this.api}/create`, data);
  }

  login(credentials: { email: string; password: string }): Observable<User> {
    return this.http.post<User>(`${this.api}/login`, credentials).pipe(
      tap((user) => {
        this.user.set(user);
        localStorage.setItem('user', JSON.stringify(user));
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

  sendResetEmail(email: string): Observable<void> {
    return this.http.post<void>('http://localhost:8080/auth/reset-password', { email });
  }
}