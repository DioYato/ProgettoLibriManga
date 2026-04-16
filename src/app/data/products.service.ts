import { Injectable, computed, signal } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { catchError, of, tap, Observable } from 'rxjs';

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

  // 🔥 AGGIUNTO types come 4° parametro
  loadFromBackend(sort?: string, genres?: number[], author?: number, types?: string[]) {
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

    // 🔥 ECCO LA PARTE CHE MANCAVA
    if (types?.length) {
      types.forEach(t => params = params.append('tipologia', t));
      // Se il backend usa un nome diverso (tipo "tipo" o "types"), dimmelo e lo cambio
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
