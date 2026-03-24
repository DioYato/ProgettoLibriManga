import { DecimalPipe } from '@angular/common';
import { Component, computed, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ProductsService } from '../../data/products.service';

@Component({
  selector: 'app-products',
  imports: [DecimalPipe, RouterLink],
  templateUrl: './products.html',
  styleUrl: './products.css',
})
export class Products {

  // Memorizza il testo di ricerca inserito dall'utente
  readonly query = signal('');

  /**
   * Lista dei prodotti filtrata in base alla ricerca.
   * Se l'utente scrive qualcosa, vengono mostrati solo i prodotti che contengono quel testo nel nome.
   * Se il campo è vuoto, vengono mostrati tutti i prodotti.
   */
  readonly products = computed(() => {
    const q = this.query().trim().toLowerCase();

    // Per ora usiamo i prodotti finti
    const items = this.productsService.all();

    if (!q) return items;

    return items.filter((p) => p.name.toLowerCase().includes(q));
  });

  constructor(private readonly productsService: ProductsService) {}

  /**
   * Aggiorna il testo di ricerca quando l'utente scrive nella barra di ricerca.
   * Questo fa automaticamente rifiltrare l'elenco dei prodotti.
   */
  onSearch(value: string) {
    this.query.set(value);
  }
}
