import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, of } from 'rxjs';

export type UtentiDTO = {
  id: number;
  nome: string;
  cognome: string;
  email?: string;
};

export type LibriDTO = {
  id: number;
  titolo: string;
};

export type Review = {
  id?: number;
  stelle: number;
  contenuto: string;
  data: string | Date;
  libro?: LibriDTO;
  utente?: UtentiDTO;
};

export type ReviewRequest = {
  idLibro: number;
  idUtente: number;
  stelle: number;
  contenuto: string;
};

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

  submitReview(review: ReviewRequest): Observable<any> {
    return this.http.post(`${this.api}/create`, review).pipe(
      catchError(err => {
        console.error('Errore nell\'invio della recensione:', err);
        throw err;
      })
    );
  }
}
