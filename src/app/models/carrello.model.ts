import { Libro } from './libro.model';
import { User } from './user.model';

export interface DettaglioCarrello {
  id: number;
  quantita: number;
  libro: Libro;
  utente: User;
}