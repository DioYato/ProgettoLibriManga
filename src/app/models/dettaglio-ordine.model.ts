import { Libro } from './libro.model';

export interface DettaglioOrdine {
  id: number;
  libro: Libro;
  quantita: number;
  costoTotale: number;
  stato: string;
  data: string;
}