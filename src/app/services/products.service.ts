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

  // Risposta paginata dal backend
  private readonly _totalProducts = signal<number>(0);
  readonly totalProducts = computed(() => this._totalProducts());

  private readonly _totalPages = signal<number>(0);
  readonly totalPages = computed(() => this._totalPages());

  constructor(private http: HttpClient) {}

  loadFromBackend(sort?: string, genres?: number[], author?: number, query?: string, page: number = 0, limit: number = 20) {
    const params = this.buildHttpParams(sort, genres, author, query, page, limit);

    const request$ = this.http.get<any>(`${this.apiUrl}/list`, { params }).pipe(
      tap(response => this.updateProductsFromResponse(response)),
      catchError(err => {
        console.error('Errore nel recupero dei libri:', err);
        this.clearProducts();
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

  private buildHttpParams(sort?: string, genres?: number[], author?: number, query?: string, page: number = 0, limit: number = 20): HttpParams {
    let params = new HttpParams();

    if (sort) params = params.set('sort', sort);
    if (genres?.length) genres.forEach(g => params = params.append('categorie', g.toString()));
    if (author) params = params.set('autore', author.toString());
    if (query) params = params.set('q', query);

    return params.set('page', page.toString()).set('limit', limit.toString());
  }

  private updateProductsFromResponse(response: any): void {
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
  }

  private clearProducts(): void {
    this._items.set([]);
    this._totalProducts.set(0);
    this._totalPages.set(0);
  }

  getByIds(ids: number[]): Observable<Product[]> {
    return this.http.post<Product[]>(`${this.apiUrl}/findByIds`, ids).pipe(
      catchError(() => of([]))
    );
  }
}
