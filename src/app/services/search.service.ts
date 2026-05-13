import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Libro } from '../models/libro.model';

@Injectable({ providedIn: 'root' })
export class SearchService {

  private readonly api = 'http://localhost:8080/prodotti';

  constructor(private http: HttpClient, private router: Router) {}

  search(term: string): void {
    const q = term.trim().toLowerCase();
    if (!q) return;

    this.http.get<Libro[]>(`${this.api}/list`).subscribe(products => {
      const match = products.find(p =>
        p.titolo.toLowerCase().includes(q)
      );

      if (match) {
        this.router.navigate(['/products', match.id]);
      } else {
        this.router.navigate(['/products'], { queryParams: { q } });
      }
    });
  }
}