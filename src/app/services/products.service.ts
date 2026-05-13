import { Injectable, computed, signal } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { catchError, map, of, tap, Observable } from 'rxjs';
import { Libro } from '../models/libro.model';

export type Product = Libro;

interface PaginatedResponse {
  content?: Libro[];
  data?: Libro[];
  total?: number;
  totalElements?: number;
  totalPages?: number;
}

@Injectable({ providedIn: 'root' })
export class ProductsService {

  private readonly apiUrl = 'http://localhost:8080/libri';

  private readonly _items = signal<Product[]>([]);
  readonly all = computed(() => this._items());

  private readonly _totalProducts = signal<number>(0);
  readonly totalProducts = computed(() => this._totalProducts());

  private readonly _totalPages = signal<number>(0);
  readonly totalPages = computed(() => this._totalPages());

  constructor(private http: HttpClient) {}

  loadFromBackend(sort?: string, genres?: number[], author?: number, query?: string, page: number = 0, limit: number = 20) {
    const request$ = this.createProductsRequest(sort, genres, author, query, page, limit).pipe(
      tap(response => this.updateProductsFromResponse(response))
    );

    request$.subscribe();
    return request$;
  }

  fetchFromBackend(sort?: string, genres?: number[], author?: number, query?: string, page: number = 0, limit: number = 20): Observable<Product[]> {
    return this.createProductsRequest(sort, genres, author, query, page, limit).pipe(
      map(response => Array.isArray(response) ? response : (response.content || response.data || []))
    );
  }

  private createProductsRequest(sort?: string, genres?: number[], author?: number, query?: string, page: number = 0, limit: number = 20) {
    const params = this.buildHttpParams(sort, genres, author, query, page, limit);
    return this.http.get<Libro[] | PaginatedResponse>(`${this.apiUrl}/list`, { params }).pipe(
      catchError(err => {
        console.error('Errore nel recupero dei libri:', err);
        return of([]);
      })
    );
  }

  getById(id: string | number | null | undefined): Product | undefined {
    if (!id) return undefined;
    return this._items().find(p => p.id == id);
  }

  fetchById(id: string | number): Observable<Product | undefined> {
    const params = new HttpParams().set('id', id.toString());
    return this.http.get<Libro>(`${this.apiUrl}/findById`, { params }).pipe(
      map(response => response ?? undefined),
      catchError(err => {
        console.error('Errore nel recupero del prodotto per ID:', err);
        return of(undefined);
      })
    );
  }

  private buildHttpParams(sort?: string, genres?: number[], author?: number, query?: string, page: number = 0, limit: number = 20): HttpParams {
    let params = new HttpParams();

    if (sort) params = params.set('sort', sort);
    if (genres?.length) genres.forEach(g => params = params.append('categorie', g.toString()));
    if (author) params = params.set('autore', author.toString());
    if (query) params = params.set('q', query);

    return params.set('page', page.toString()).set('limit', limit.toString());
  }

  private updateProductsFromResponse(response: Libro[] | PaginatedResponse): void {
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