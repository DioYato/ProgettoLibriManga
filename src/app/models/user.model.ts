import { Libro } from './libro.model';

export interface User {
  id: number;
  nome: string;
  cognome: string;
  email: string;
  ruolo?: string;
  via?: string;
  provincia?: string;
  telefono?: string;
  immagineProfilo?: string;
  libriPreferiti?: Libro[];
  password?: string;
}