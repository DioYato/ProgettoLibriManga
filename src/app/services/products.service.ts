import { Injectable, computed, signal } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { catchError, of, tap, Observable } from 'rxjs';

export type Author = {
  nome: string;
  cognome: string;
}

// per il componente product-detail
export type Category = {
  id?: number;
  categoria: string;
}


export type Product = {
  id: number;
  titolo: string;
  autore: Author;
  categorie: Category[];
  quantitaDisponibile: number;
  prezzo: number;
  descrizione: string;
  copertina?: string;
};

@Injectable({ providedIn: 'root' })
export class ProductsService {

  private readonly apiUrl = 'http://localhost:8080/libri';

  private readonly _items = signal<Product[]>([]);
  readonly all = computed(() => this._items());

  // BACKEND DEVE FORNIRE: { data: Product[], total: number, totalPages: number, currentPage: number }
  private readonly _totalProducts = signal<number>(0);
  readonly totalProducts = computed(() => this._totalProducts());

  private readonly _totalPages = signal<number>(0);
  readonly totalPages = computed(() => this._totalPages());

  constructor(private http: HttpClient) {}

  loadFromBackend(sort?: string, genres?: number[], author?: number, query?: string, page: number = 1, limit: number = 20) {
    let params = new HttpParams();

    if (sort) {
      params = params.set('sort', sort);
    }

    if (genres?.length) {
      genres.forEach(g => params = params.append('categorie', g.toString()));
    }

    if (author) {
      params = params.set('autore', author.toString());
    }

    if (query) {
      params = params.set('q', query);
    }

    // AGGIUNGI QUESTI PARAMETRI AL BACKEND
    params = params.set('page', page.toString());
    params = params.set('limit', limit.toString());

    const request$ = this.http.get<any>(`${this.apiUrl}/list`, { params }).pipe(
      tap(response => {
        // Retrocompatibilità: accetta sia array che oggetto paginato
        if (Array.isArray(response)) {
          this._items.set(response);
          this._totalProducts.set(response.length);
          this._totalPages.set(1);
        } else {
          const content = response.content || response.data || [];
          const total = response.total ?? response.totalElements ?? 0;
          const totalPages = response.totalPages ?? 1;

          this._items.set(content);
          this._totalProducts.set(total);
          this._totalPages.set(totalPages);
        }
      }),
      catchError(err => {
        console.error('Errore nel recupero dei libri:', err);
        this._items.set([]);
        this._totalProducts.set(0);
        this._totalPages.set(0);
        return of([]);
      })
    );

    request$.subscribe();
    return request$;
  }

  getById(id: string | number | null | undefined) {
    if (!id) return undefined;
    return this._items().find(p => p.id == id);
  }

  getByIds(ids: number[]): Observable<Product[]> {
    return this.http.post<Product[]>(`${this.apiUrl}/findByIds`, ids).pipe(
      catchError(() => of([]))
    );
  }
}
