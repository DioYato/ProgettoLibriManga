import { HttpClient, HttpParams } from '@angular/common/http';
import { computed, Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, map, of } from 'rxjs';
import { User } from '../models/user.model';
import { Libro } from '../models/libro.model';

interface FavoriteRequest {
  idUtente: number;
  idLibro: number;
}

@Injectable({ providedIn: 'root' })
export class FavoritesService {
  private readonly backendUrl = 'http://localhost:8080/utenti';

  private readonly _ids = signal<number[]>([]);
  readonly ids = computed(() => this._ids());

  constructor(private http: HttpClient, private router: Router) {
    this.initFavorites();
  }

  private initFavorites() {
    const userId = this.getUserId();
    if (!userId) {
      this._ids.set([]);
      return;
    }
    this._ids.set(this.loadFromStorage());
  }

  private getUserId(): number | null {
    const stored = localStorage.getItem('user');
    if (!stored) return null;
    try {
      return JSON.parse(stored).id;
    } catch {
      return null;
    }
  }

  private getStorageKey(): string | null {
    const userId = this.getUserId();
    return userId ? `favorites_${userId}` : null;
  }

  private loadFromStorage(): number[] {
    const storageKey = this.getStorageKey();
    if (!storageKey) return [];
    try {
      const data = localStorage.getItem(storageKey);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  }

  private saveToStorage(ids: number[]): void {
    const storageKey = this.getStorageKey();
    if (!storageKey) return;
    localStorage.setItem(storageKey, JSON.stringify(ids));
  }

  private addFavoriteOnBackend(productId: number): void {
    const userId = this.getUserId();
    if (!userId) return;

    const req: FavoriteRequest = { idUtente: userId, idLibro: productId };
    this.http.post<void>(`${this.backendUrl}/addFavourite`, req)
      .pipe(catchError(() => of(null)))
      .subscribe();
  }

  private removeFavoriteOnBackend(productId: number): void {
    const userId = this.getUserId();
    if (!userId) return;

    const params = new HttpParams()
      .set('idUtente', String(userId))
      .set('idLibro', String(productId));

    this.http.delete<void>(`${this.backendUrl}/deleteFavourite`, { params })
      .pipe(catchError(() => of(null)))
      .subscribe();
  }

  loadFromBackend() {
    const userId = this.getUserId();
    if (!userId) return of([]);

    const params = new HttpParams().set('id', String(userId));
    return this.http.get<User>(`${this.backendUrl}/findById`, { params }).pipe(
      map(response => {
        const ids = (response.libriPreferiti || []).map((p: Libro) => p.id);
        this._ids.set(ids);
        this.saveToStorage(ids);
        return ids;
      }),
      catchError(() => of(this._ids()))
    );
  }

  isFavorite(id: number): boolean {
    return this._ids().includes(id);
  }

  toggle(id: number): void {
    const userId = this.getUserId();
    if (!userId) {
      this.router.navigate(['/login']);
      return;
    }

    const current = this._ids();
    const exists = current.includes(id);

    const updated = exists
      ? current.filter(x => x !== id)
      : [...current, id];

    this._ids.set(updated);
    this.saveToStorage(updated);

    if (exists) {
      this.removeFavoriteOnBackend(id);
    } else {
      this.addFavoriteOnBackend(id);
    }
  }

  clearLocalFavorites(userId?: number): void {
    if (userId) {
      localStorage.removeItem(`favorites_${userId}`);
    }
    this._ids.set([]);
  }

  count(): number {
    return this._ids().length;
  }
}