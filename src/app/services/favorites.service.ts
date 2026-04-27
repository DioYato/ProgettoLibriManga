import { HttpClient, HttpParams } from '@angular/common/http';
import { computed, Injectable, signal } from '@angular/core';
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

  constructor(private http: HttpClient) {
    this.initFavorites();
  }

  private initFavorites() {
    const userId = this.getUserId();
    // Pulizia vecchia chiave generica se esiste un utente loggato
    if (userId && localStorage.getItem('favorites')) {
      localStorage.removeItem('favorites');
    }
    
    // Caricamento iniziale dai dati salvati nel browser
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

  // Genera una chiave specifica per utente o una per ospiti
  private getStorageKey(): string {
    const userId = this.getUserId();
    return userId ? `favorites_${userId}` : 'favorites_guest';
  }

  // Legge i dati dal localStorage in modo sicuro
  private loadFromStorage(): number[] {
    try {
      const data = localStorage.getItem(this.getStorageKey());
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  }

  // Salva i dati nel localStorage in modo sicuro
  private saveToStorage(ids: number[]) {
    localStorage.setItem(this.getStorageKey(), JSON.stringify(ids));
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

  // Sincronizza i dati locali con quelli salvati sul database
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

  // Aggiunge o rimuove un preferito (gestisce UI e Backend insieme)
  toggle(id: number) {
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

  // Restituisce il numero di preferiti salvati
  count() {
    return this._ids().length;
  }
}
