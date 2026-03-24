import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';

export interface Product {
  id: number;
  title: string;
  author: string;
  price: number;
  image: string;
  description: string;
}

@Injectable({
  providedIn: 'root'
})
export class BookService {
  constructor(private http: HttpClient) {}

  // Mock per ottenere tutti i libri - quando backend pronto, sostituisci con chiamata HTTP
  all(): Observable<Product[]> {
    // TODO: Quando il backend sarà pronto, usa:
    // return this.http.get<Product[]>('/api/books');
    const mockBooks: Product[] = [
      { id: 1, title: 'Libro 1', author: 'Autore 1', price: 10.99, image: 'path/to/image1.jpg', description: 'Descrizione 1' },
      { id: 2, title: 'Libro 2', author: 'Autore 2', price: 12.99, image: 'path/to/image2.jpg', description: 'Descrizione 2' },
    ];
    return of(mockBooks);
  }

  // Mock per ottenere dettagli libro - quando backend pronto, sostituisci con chiamata HTTP
  details(id: number): Observable<Product> {
    // TODO: Quando il backend sarà pronto, usa:
    // return this.http.get<Product>(`/api/books/${id}`);
    const mockBook: Product = { id, title: `Libro ${id}`, author: `Autore ${id}`, price: 10.99 + id, image: `path/to/image${id}.jpg`, description: `Descrizione ${id}` };
    return of(mockBook);
  }
}