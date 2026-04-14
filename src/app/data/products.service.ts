import { Injectable, computed, signal } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { catchError, of, tap, Observable } from 'rxjs';

export type Author = {
  nome: string;
  cognome: string;
}

export type Product = {
  immagine: any; // Lasciato any per compatibilità totale con i dati del DB
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

  // Stato interno e computato per la reattività
  private readonly _items = signal<Product[]>([]);
  readonly all = computed(() => this._items());

  constructor(private http: HttpClient) {}

  // Carica i libri dal backend e aggiorna il signal
  loadFromBackend(sort?: string, genres?: number[], author?: string) {
    let params = new HttpParams();

    if (sort) {
      params = params.set('sort', sort);
    }

    if (genres?.length) {
      // Conversione esplicita a string per evitare problemi con HttpParams
      genres.forEach(g => params = params.append('categorie', g.toString()));
    }

    if (author) {
    params = params.set('autore', author); 
  }

    const request$ = this.http.get<Product[]>(`${this.apiUrl}/list`, { params }).pipe(
      tap(products => this._items.set(products)),
      catchError(err => {
        console.error('Errore nel recupero dei libri:', err);
        this._items.set([]);
        return of([] as Product[]);
      })
    );

    // Mantenuto il subscribe interno per far partire la chiamata subito
    request$.subscribe();
    return request$;
  }

  // Restituisce un libro cercandolo nello stato locale (per ID)
  getById(id: string | number | null | undefined) {
    if (!id) return undefined;
    // Il doppio uguale (==) serve a confrontare stringhe e numeri senza errori
    return this._items().find(p => p.id == id);
  }

  // Recupera i dettagli per una lista specifica di ID (es. carrello)
  getByIds(ids: number[]): Observable<Product[]> {
    // Corretto l'URL: prima puntava a una cartella '/api' inesistente
    return this.http.post<Product[]>(`${this.apiUrl}/findByIds`, ids).pipe(
      catchError(() => of([]))
    );
  }
}
