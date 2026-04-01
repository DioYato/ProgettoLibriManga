import { Component, computed, inject } from '@angular/core';
import { CartService } from '../../data/cart.service';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-cart',
  standalone: true,
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

  // ⬇️⬇️⬇️ QUI VA LA FUNZIONE CHE MI HAI CHIESTO ⬇️⬇️⬇️
  sendOrder() {
    const items = this.cart.all(); // prodotti nel carrello

    this.http.post('http://localhost:8080/ordini', {
      prodotti: items
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
}

