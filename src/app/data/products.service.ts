import { Injectable, computed, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';

export type Author = {
  nome: string;
  cognome: string;
}

export type Product = {
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

  /**
   * Stato interno dei prodotti.
   * Parte vuoto e viene popolato dal backend.
   */
  private readonly items = signal<Product[]>([]);

  /**
   * Vista in sola lettura dei prodotti.
   * I componenti possono sottoscriversi a questo segnale.
   */
  readonly all = computed(() => this.items());

  constructor(private http: HttpClient) {}

  /**
   * Carica i prodotti dal backend e aggiorna lo stato interno.
   */
  loadFromBackend() {
    this.http.get<Product[]>(`${this.apiUrl}/list`).subscribe({
      next: (products) => this.items.set(products),
      error: (err) => console.error('Errore caricamento prodotti:', err),
    });
  }

  /**
   * Restituisce un prodotto per ID.
   * Funziona dopo che i prodotti sono stati caricati.
   */
  getById(id: string | number | null | undefined) {
    if (!id) return undefined;
    return this.items().find((p) => p.id == id);
  }
}


