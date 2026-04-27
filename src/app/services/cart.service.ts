import { computed, effect, Injectable, signal } from '@angular/core';
import { Product } from './products.service';

export type CartItem = {
  product: Product;
  quantity: number;
};

@Injectable({ providedIn: 'root' })
export class CartService {

  // Signal per lo stato del carrello
  private readonly items = signal<CartItem[]>([]);

  readonly all = computed(() => this.items());

  readonly total = computed(() =>
    this.items().reduce((sum, item) => sum + item.product.prezzo * item.quantity, 0)
  );

  readonly count = computed(() =>
    this.items().reduce((sum, item) => sum + item.quantity, 0)
  );

  constructor() {
    // Caricamento iniziale sicuro solo lato client
    const stored = localStorage.getItem('cart');
    if (stored) {
      this.items.set(JSON.parse(stored));
    }

    // Sincronizzazione automatica con localStorage solo nel browser
    effect(() => {
      localStorage.setItem('cart', JSON.stringify(this.items()));
    });
  }

  // Aggiunge un prodotto o ne incrementa la quantità
  add(product: Product) {
    const current = this.items();
    const existing = current.find(i => i.product.id === product.id);

    if (existing) {
      this.items.set(
        current.map(i =>
          i.product.id === product.id ? { ...i, quantity: i.quantity + 1 } : i
        )
      );
    } else {
      this.items.set([...current, { product, quantity: 1 }]);
    }
  }

  updateQuantity(productId: number, quantity: number) {
    const current = this.items();
    const existing = current.find(i => i.product.id === productId);

    if (existing) {
      this.items.set(
        current.map(i =>
          i.product.id === productId ? { ...i, quantity } : i
        )
      );
    }
  }

  // Riduce la quantità o rimuove se arriva a zero
  decrease(productId: number) {
    const current = this.items();
    const existing = current.find(i => i.product.id === productId);

    if (existing && existing.quantity > 1) {
      this.items.set(
        current.map(i =>
          i.product.id === productId ? { ...i, quantity: i.quantity - 1 } : i
        )
      );
    } else {
      this.remove(productId);
    }
  }

  // Rimuove completamente un prodotto
  remove(productId: number) {
    this.items.update(prev => prev.filter(i => i.product.id !== productId));
  }

  // Svuota il carrello
  clear() {
    this.items.set([]);
  }
}