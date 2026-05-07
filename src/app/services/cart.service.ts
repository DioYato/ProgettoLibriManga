import { Injectable, signal, computed, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class CartService {

  private readonly http = inject(HttpClient);
  private readonly items = signal<any[]>([]);

  readonly all = computed(() => this.items());
  readonly total = computed(() =>
    this.items().reduce((sum, item) => sum + item.libro.prezzo * item.quantita, 0)
  );
  readonly count = computed(() =>
    this.items().reduce((sum, item) => sum + item.quantita, 0)
  );

  load(userId: number) {
    this.http
      .get<any[]>(`http://localhost:8080/carrello/findByUtente?idUtente=${userId}`)
      .subscribe(r => this.items.set(r));
  }

  add(userId: number, bookId: number, qty: number = 1) {
    this.http.post('http://localhost:8080/carrello/create', {
      idUtente: userId,
      idLibro: bookId,
      quantita: qty
    }).subscribe(() => this.load(userId));
  }

  updateQuantity(cartItemId: number, qty: number, userId: number) {
    this.http.put('http://localhost:8080/carrello/update', {
      id: cartItemId,
      quantita: qty
    }).subscribe(() => this.load(userId));
  }

  remove(cartItemId: number, userId: number) {
    this.http
      .delete(`http://localhost:8080/carrello/delete?id=${cartItemId}`)
      .subscribe(() => this.load(userId));
  }

  clearLocal() {
    this.items.set([]);
  }
}
