import { HttpClient, HttpParams } from '@angular/common/http';
import { computed, Injectable, signal, inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, map, of } from 'rxjs';
import { User } from '../models/user.model';
import { Libro } from '../models/libro.model';
import { ProductsService } from './products.service';

interface FavoriteRequest {
  idUtente: number;
  idLibro: number;
}

@Injectable({ providedIn: 'root' })
export class FavoritesService {
  private readonly backendUrl = 'http://localhost:8080/utenti';

  private readonly _favorites = signal<Libro[]>([]);
  readonly favorites = computed(() => this._favorites());

  private readonly _products = inject(ProductsService);

  constructor(private http: HttpClient, private router: Router) {
    this.initFavorites();
  }

  private initFavorites() {
    const userId = this.getUserId();
    if (!userId) {
      this._favorites.set([]);
      return;
    }
    this._favorites.set(this.loadFromStorage());
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

  private loadFromStorage(): Libro[] {
    const storageKey = this.getStorageKey();
    if (!storageKey) return [];
    try {
      const data = localStorage.getItem(storageKey);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  }

  private saveToStorage(favorites: Libro[]): void {
    const storageKey = this.getStorageKey();
    if (!storageKey) return;
    localStorage.setItem(storageKey, JSON.stringify(favorites));
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
        const libri = response.libriPreferiti || [];
        this._favorites.set(libri);
        this.saveToStorage(libri);
        return libri;
      }),
      catchError(() => of(this._favorites()))
    );
  }

  isFavorite(id: number): boolean {
    return this._favorites().some(libro => libro.id === id);
  }

  toggle(id: number): void {
    const userId = this.getUserId();
    if (!userId) {
      this.router.navigate(['/login']);
      return;
    }

    const libro = this._products.all().find(p => p.id === id);
    if (!libro) return;

    const current = this._favorites();
    const exists = current.some(l => l.id === id);

    const updated = exists
      ? current.filter(l => l.id !== id)
      : [...current, libro];

    this._favorites.set(updated);
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
    this._favorites.set([]);
  }

  count(): number {
    return this._favorites().length;
  }
}