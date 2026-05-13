import { User } from './user.model';
import { DettaglioOrdine } from './dettaglio-ordine.model';

export interface Ordine {
  id: number;
  utente: User;
  dettagliOrdine: DettaglioOrdine[];
}
