import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, of } from 'rxjs';

export type Review = {
  id?: number;
  libroId: number;
  utenteId: number;
  nomeUtente: string;
  valutazione: number;
  commento: string;
  data: string;
};

@Injectable({ providedIn: 'root' })
export class ReviewsService {

  private readonly api = 'http://localhost:8080/recensioni';

  constructor(private http: HttpClient) {}

  // Se il backend usa un path o una query diversa, aggiornare qui l'endpoint
  getByProduct(libroId: number): Observable<Review[]> {
    const params = new HttpParams().set('libroId', libroId.toString());
    return this.http.get<Review[]>(this.api, { params }).pipe(
      catchError(err => {
        console.error('Errore nel caricamento delle recensioni:', err);
        return of([]);
      })
    );
  }

  // Aggiornare questo endpoint se il backend richiede un percorso diverso o un payload con campi differenti.
  submitReview(review: Review): Observable<Review> {
    return this.http.post<Review>(this.api, review).pipe(
      catchError(err => {
        console.error('Errore nell\'invio della recensione:', err);
        return of(review);
      })
    );
  }
}
