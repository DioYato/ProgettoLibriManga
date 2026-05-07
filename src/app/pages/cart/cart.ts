import { Component, computed, inject } from '@angular/core';
import { CartService } from '../../services/cart.service';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.html',
  styleUrl: './cart.css',
})
export class Cart {

  private readonly cart = inject(CartService);
  private readonly http = inject(HttpClient);

  readonly items = computed(() => this.cart.all());
  readonly total = computed(() => this.cart.total());

  private userId: number | null = null;

  constructor() {
    const stored = localStorage.getItem('user');
    if (stored) {
      const user = JSON.parse(stored);
      this.userId = user.id;
      this.cart.load(user.id);
    }
  }

  remove(cartItemId: number) {
    if (!this.userId) return;
    this.cart.remove(cartItemId, this.userId);
  }

  updateQuantity(cartItemId: number, event: Event) {
    if (!this.userId) return;
    const input = event.target as HTMLInputElement;
    const qty = parseInt(input.value);
    const value = isNaN(qty) || qty < 1 ? 1 : qty;
    input.value = value.toString();
    this.cart.updateQuantity(cartItemId, value, this.userId);
  }

  imageUrl(copertina?: string) {
    return copertina ? `http://localhost:8080/images/${copertina}` : '';
  }

  sendOrder() {
    if (!this.userId) {
      alert('Devi essere loggato per inviare un ordine.');
      return;
    }

    this.http
      .post(`http://localhost:8080/carrello/acquista?idUtente=${this.userId}`, {})
      .subscribe({
        next: () => {
          alert('Ordine inviato con successo!');
          this.cart.clearLocal();
        },
        error: () => {
          alert('Errore durante l’invio dell’ordine.');
        }
      });
  }
}

