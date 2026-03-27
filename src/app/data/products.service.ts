import { Injectable, computed, signal } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { ProductFilters } from '../pages/filters/filters.component';

export type Author = {
  nome: string;
  cognome: string;
}

export type Product = {
  immagine: any;
  id: number;
  titolo: string;
  autore: Author;
  prezzo: number;
  descrizione: string;
  copertina?: string;
};

@Injectable({ providedIn: 'root' })
export class ProductsService {

  private readonly apiUrl = 'http://localhost:8080/libri';

  // Stato interno
  private readonly _items = signal<Product[]>([]);

  // Vista pubblica in sola lettura
  readonly all = computed(() => this._items());

  constructor(private http: HttpClient) {}

  /**
   * Carica i prodotti dal backend con sort + filtri.
   * Se sort o filtri non ci sono, non li manda.
   */
  loadFromBackend(sort?: string, genres?: number[]) {
    let params = new HttpParams();

    if (sort) {
      params = params.set('sort', sort);
    }

    if (genres && genres.length > 0) {
      genres.forEach(g => {
        params = params.append('categorie', g);
      });
    }

    this.http.get<Product[]>(`${this.apiUrl}/list`, { params })
      .subscribe({
        next: (products) => this._items.set(products),
        error: (err) => console.error('Errore caricamento prodotti:', err),
      });
  }

  /**
   * Restituisce un singolo prodotto per ID.
   */
  getById(id: string | number | null | undefined) {
    if (!id) return undefined;
    return this._items().find((p) => p.id == id);
  }
}





