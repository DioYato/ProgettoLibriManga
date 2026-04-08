import { Component, computed, inject } from '@angular/core';
import { CartService } from '../../data/cart.service';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.html',
  styleUrl: './cart.css',
})
export class Cart {

  // servizi
  private readonly cart = inject(CartService);
  private readonly http = inject(HttpClient);

  // signals
  readonly items = computed(() => this.cart.all());
  readonly total = computed(() => this.cart.total());

  remove(id: number) {
    this.cart.remove(id);
  }

  imageUrl(copertina?: string) {
    if (!copertina) return '';
    return `http://localhost:8080/images/${copertina}`;
  }

  sendOrder() {
    const items = this.cart.all(); // prodotti nel carrello

    if (!this.isBrowser()) {
      alert('Impossibile inviare ordine dal server.');
      return;
    }

    const stored = localStorage.getItem('user');
    if (!stored) {
      alert('Devi essere loggato per inviare un ordine.');
      return;
    }

    const user = JSON.parse(stored);

    const prodotti = items.map(item => ({
      idLibro: item.product.id,
      quantita: item.quantity
    }));

    this.http.post('http://localhost:8080/ordini/create', {
      idUtente: user.id,
      dettagliOrdini: prodotti
    }).subscribe({
      next: () => {
        alert('Ordine inviato con successo!');
        this.cart.clear(); // svuota il carrello
      },
      error: () => {
        alert('Errore durante l’invio dell’ordine.');
      }
    });
  }

  private isBrowser(): boolean {
    return typeof window !== 'undefined';
  }
}

