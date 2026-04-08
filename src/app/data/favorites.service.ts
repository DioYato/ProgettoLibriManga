import { Injectable, signal, computed } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { catchError, map, of } from 'rxjs';

interface FavoriteRequest {
  idUtente: number;
  idLibro: number;
}

@Injectable({ providedIn: 'root' })
export class FavoritesService {
  private readonly storageKey = 'favorites';
  private readonly backendUrl = 'http://localhost:8080/utenti';

  private readonly _ids = signal<number[]>(this.loadFromStorage());
  readonly ids = computed(() => this._ids());

  constructor(private http: HttpClient) {}

  private isBrowser(): boolean {
    return typeof window !== 'undefined';
  }

  private getUserId(): number | null {
    if (!this.isBrowser()) return null;
    const stored = localStorage.getItem('userId');
    return stored ? Number(stored) : null;
  }

  private loadFromStorage(): number[] {
    if (!this.isBrowser()) return [];
    try {
      return JSON.parse(localStorage.getItem(this.storageKey) || '[]');
    } catch {
      return [];
    }
  }

  private saveToStorage(ids: number[]) {
    if (!this.isBrowser()) return;
    localStorage.setItem(this.storageKey, JSON.stringify(ids));
  }

  private addFavoriteOnBackend(productId: number) {
    const userId = this.getUserId();
    if (!userId) return;

    const req: FavoriteRequest = { idUtente: userId, idLibro: productId };

    this.http.post(`${this.backendUrl}/addFavourite`, req)
      .pipe(catchError(() => of(null)))
      .subscribe();
  }

  private removeFavoriteOnBackend(productId: number) {
    const userId = this.getUserId();
    if (!userId) return;

    const params = new HttpParams()
      .set('idUtente', String(userId))
      .set('idLibro', String(productId));

    this.http.delete(`${this.backendUrl}/deleteFavourite`, { params })
      .pipe(catchError(() => of(null)))
      .subscribe();
  }

  loadFromBackend() {
    const userId = this.getUserId();
    if (!userId) return of(this._ids());

    const params = new HttpParams().set('id', String(userId));

    return this.http.get<any>(`${this.backendUrl}/findById`, { params }).pipe(
      map((response) => {
        const ids = response.libriPreferiti.map((p: any) => p.id);
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

  toggle(id: number) {
    const current = this._ids();
    const updated = current.includes(id)
      ? current.filter(x => x !== id)
      : [...current, id];

    this._ids.set(updated);
    this.saveToStorage(updated);

    if (current.includes(id)) {
      this.removeFavoriteOnBackend(id);
    } else {
      this.addFavoriteOnBackend(id);
    }
  }

  count() {
    return this._ids().length;
  }
}

