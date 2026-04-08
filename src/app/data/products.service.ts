import { Injectable, computed, signal } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { catchError, of, tap } from 'rxjs';

export type Author = {
  nome: string;
  cognome: string;
}

export type Product = {
  immagine: any;
  id: number;
  titolo: string;
  autore: Author;
  quantita: number;
  prezzo: number;
  descrizione: string;
  copertina?: string;
};

@Injectable({ providedIn: 'root' })
export class ProductsService {

  private readonly apiUrl = 'http://localhost:8080/libri';

  private readonly _items = signal<Product[]>([]);
  readonly all = computed(() => this._items());

  constructor(private http: HttpClient) {}

  loadFromBackend(sort?: string, genres?: number[]) {
    let params = new HttpParams();

    if (sort) {
      params = params.set('sort', sort);
    }

    if (genres?.length) {
      genres.forEach(g => params = params.append('categorie', g));
    }

    const request$ = this.http.get<Product[]>(`${this.apiUrl}/list`, { params }).pipe(
      tap(products => this._items.set(products)),
      catchError(err => {
        console.error('Errore caricamento prodotti:', err);
        this._items.set([]);
        return of([] as Product[]);
      })
    );

    request$.subscribe();
    return request$;
  }

  getById(id: string | number | null | undefined) {
    if (!id) return undefined;
    return this._items().find(p => p.id == id);
  }

  getByIds(ids: number[]) {
    return this.http.post<Product[]>('/api/products/by-ids', ids);
  }
}
