import { DecimalPipe } from '@angular/common';
import { Component, computed, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ProductsService } from '../../data/products.service';

@Component({
  selector: 'app-product-detail',
  imports: [RouterLink, DecimalPipe],
  templateUrl: './product-detail.html',
  styleUrl: './product-detail.css',
})
export class ProductDetail {
  readonly tab = signal<'descrizione' | 'dettagli'>('descrizione');

  /**
   * Parametro di rotta usato come identificatore del prodotto.
   *
   * Migrazione backend:
   * - Mantieni stabile il nome del parametro (`id`) per non rompere i link salvati/condivisi.
   * - Se il backend usa ID numerici, normalizza in modo coerente (string -> number) in un solo punto.
   */
  private readonly id = computed(() => this.route.snapshot.paramMap.get('id'));
  readonly product = computed(() => this.products.getById(this.id()));

  readonly selectedFormatIndex = signal(0);
  readonly selectedFormat = computed(() => {
    const p = this.product();
    const formats = p?.formats ?? [];
    const idx = this.selectedFormatIndex();
    return formats[Math.max(0, Math.min(idx, formats.length - 1))];
  });

  readonly currentPrice = computed(() => {
    const p = this.product();
    if (!p) return 0;
    return this.selectedFormat()?.price ?? p.price;
  });

  constructor(
    private readonly route: ActivatedRoute,
    private readonly products: ProductsService,
  ) {}

  /**
   * Cambia la scheda visualizzata tra descrizione dettagliata e specificità del prodotto.
   */
  setTab(tab: 'descrizione' | 'dettagli') {
    this.tab.set(tab);
  }

  /**
   * Aggiorna il formato scelto quando l'utente lo cambia nel dropdown.
   * Questo modifica automaticamente il prezzo visualizzato.
   */
  onFormatChange(value: string) {
    const idx = Number(value);
    this.selectedFormatIndex.set(Number.isFinite(idx) ? idx : 0);
  }

  /**
   * Aggiunge il libro al carrello.
   * Attualmente mostra solo un messaggio di conferma (mock).
   * Quando il backend sarà pronto, invierà i dati al servizio carrello.
   */
  addToCart() {
    /**
     * Migrazione backend:
     * - Crea un `CartService` e sposta lì lo stato del carrello
     * - Se vuoi persistere lato server: POST `/api/cart/items` con `{ productId, quantity, format? }`
     * - Sostituisci l’alert con un feedback UI (toast/snackbar)
     */
    alert('Aggiunto al carrello (mock)');
  }
}

