import { User } from './user.model';
import { Libro } from './libro.model';

export interface Review {
  id?: number;
  stelle: number;
  contenuto: string;
  data: string | Date;
  libro?: Libro;
  utente?: User;
}

export interface ReviewRequest {
  idLibro: number;
  idUtente: number;
  stelle: number;
  contenuto: string;
}