import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, of } from 'rxjs';
import { Review, ReviewRequest } from '../models/review.model';

@Injectable({ providedIn: 'root' })
export class ReviewsService {

  private readonly api = 'http://localhost:8080/recensioni';

  constructor(private http: HttpClient) {}

  getByProduct(libroId: number): Observable<Review[]> {
    return this.http.get<Review[]>(`${this.api}/findByIdLibro?idLibro=${libroId}`).pipe(
      catchError(err => {
        console.error('Errore nel caricamento delle recensioni:', err);
        return of([]);
      })
    );
  }

  submitReview(review: ReviewRequest): Observable<void> {
    return this.http.post<void>(`${this.api}/create`, review).pipe(
      catchError(err => {
        console.error('Errore nell\'invio della recensione:', err);
        throw err;
      })
    );
  }
}