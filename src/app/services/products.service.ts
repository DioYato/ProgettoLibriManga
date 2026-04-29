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

  constructor(private http: HttpClient) {}

  loadFromBackend(sort?: string, genres?: number[], author?: number) {
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

    const request$ = this.http.get<Product[]>(`${this.apiUrl}/list`, { params }).pipe(
      tap(products => this._items.set(products)),
      catchError(err => {
        console.error('Errore nel recupero dei libri:', err);
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

  getByIds(ids: number[]): Observable<Product[]> {
    return this.http.post<Product[]>(`${this.apiUrl}/findByIds`, ids).pipe(
      catchError(() => of([]))
    );
  }
}
