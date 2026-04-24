import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Injectable({ providedIn: 'root' })
export class SearchService {

  private readonly api = 'http://localhost:8080/prodotti';

  constructor(private http: HttpClient, private router: Router) {}

  search(term: string) {
    const q = term.trim().toLowerCase();
    if (!q) return;

    this.http.get<any[]>(`${this.api}/list`).subscribe(products => {
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
