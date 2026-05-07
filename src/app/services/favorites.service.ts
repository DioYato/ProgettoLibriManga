import { HttpClient, HttpParams } from '@angular/common/http';
import { computed, Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, map, of } from 'rxjs';

interface FavoriteRequest {
  idUtente: number;
  idLibro: number;
}

@Injectable({ providedIn: 'root' })
export class FavoritesService {
  private readonly backendUrl = 'http://localhost:8080/utenti';

  // Stato reattivo degli ID preferiti
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

    // Ripristina i preferiti salvati localmente per l'utente
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

  // Genera una chiave specifica per l'utente
  private getStorageKey(): string | null {
    const userId = this.getUserId();
    return userId ? `favorites_${userId}` : null;
  }

  // Legge i preferiti dal browser senza bloccare l'app
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

  // Salva i dati nel localStorage in modo sicuro
  private saveToStorage(ids: number[]) {
    const storageKey = this.getStorageKey();
    if (!storageKey) return;
    localStorage.setItem(storageKey, JSON.stringify(ids));
  }

  // --- Chiamate al Backend ---

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

  // Sincronizza lo stato locale dei preferiti con i dati sul server
  loadFromBackend() {
    const userId = this.getUserId();
    if (!userId) return of([]);

    const params = new HttpParams().set('id', String(userId));
    return this.http.get<any>(`${this.backendUrl}/findById`, { params }).pipe(
      map(response => {
        const ids = (response.libriPreferiti || []).map((p: any) => p.id);
        this._ids.set(ids);
        this.saveToStorage(ids);
        return ids;
      }),
      catchError(() => of(this._ids()))
    );
  }

  // --- Metodi Pubblici per i Componenti ---

  isFavorite(id: number): boolean {
    return this._ids().includes(id);
  }

  // Alterna lo stato del preferito in locale e invia la modifica al backend
  toggle(id: number) {
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

  clearLocalFavorites(userId?: number) {
    if (userId) {
      localStorage.removeItem(`favorites_${userId}`);
    }
    this._ids.set([]);
  }

  // Restituisce il numero di preferiti salvati
  count() {
    return this._ids().length;
  }
}
