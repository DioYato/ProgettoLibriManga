import { computed, effect, Injectable, signal } from '@angular/core';
import { Product } from './products.service';

export type CartItem = {
  product: Product;
  quantity: number;
};

@Injectable({ providedIn: 'root' })
export class CartService {

  private readonly items = signal<CartItem[]>([]);

  readonly all = computed(() => this.items());

  readonly total = computed(() =>
    this.items().reduce((sum, item) => sum + item.product.prezzo * item.quantity, 0)
  );

  readonly count = computed(() =>
    this.items().reduce((sum, item) => sum + item.quantity, 0)
  );

  constructor() {
    const stored = localStorage.getItem('cart');
    if (stored) {
      this.items.set(JSON.parse(stored));
    }

    // Aggiorna lo storage ogni volta che cambia il carrello
    effect(() => {
      localStorage.setItem('cart', JSON.stringify(this.items()));
    });
  }

  // Aggiunge un prodotto o incrementa la quantità se già presente
  add(product: Product, qty: number = 1) {
    const current = this.items();
    const existing = current.find(i => i.product.id === product.id);

    if (existing) {
      this.items.set(
        current.map(i =>
          i.product.id === product.id
            ? { ...i, quantity: i.quantity + qty }
            : i
        )
      );
    } else {
      this.items.set([...current, { product, quantity: qty }]);
    }
  }

  // Aggiorna la quantità di un elemento già presente
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

  // Riduce la quantità; elimina l'articolo se arriva a zero
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

  remove(productId: number) {
    this.items.update(prev => prev.filter(i => i.product.id !== productId));
  }

  clear() {
    this.items.set([]);
  }
}
