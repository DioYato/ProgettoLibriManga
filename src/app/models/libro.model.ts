import { Autore } from './autore.model';
import { Categoria } from './categoria.model';
import { CasaEditrice } from './casa-editrice.model';

export interface Libro {
  id: number;
  titolo: string;
  descrizione: string;
  copertina: string;
  prezzo: number;
  dataPubblicazione: string; // LocalDate dal backend arriva come stringa in JSON
  quantitaDisponibile: number;
  autore: Autore;
  categorie: Categoria[];
  casaEditrice: CasaEditrice;
}