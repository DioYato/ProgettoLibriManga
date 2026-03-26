import { Injectable, signal, computed } from '@angular/core';
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

  add(product: Product) {
    const current = this.items();
    const existing = current.find(i => i.product.id === product.id);

    if (existing) {
      existing.quantity++;
      this.items.set([...current]);
    } else {
      this.items.set([...current, { product, quantity: 1 }]);
    }
  }

  remove(productId: number) {
    this.items.set(this.items().filter(i => i.product.id !== productId));
  }

  clear() {
    this.items.set([]);
  }
}
