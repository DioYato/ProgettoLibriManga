import { Injectable, signal, computed, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { DettaglioCarrello } from '../models/carrello.model';

@Injectable({ providedIn: 'root' })
export class CartService {

  private readonly http = inject(HttpClient);
  private readonly items = signal<DettaglioCarrello[]>([]);

  readonly all = computed(() => this.items());
  readonly total = computed(() =>
    this.items().reduce((sum, item) => sum + item.libro.prezzo * item.quantita, 0)
  );
  readonly count = computed(() =>
    this.items().reduce((sum, item) => sum + item.quantita, 0)
  );

  load(userId: number) {
    this.http
      .get<DettaglioCarrello[]>(`http://localhost:8080/carrello/findByUtente?idUtente=${userId}`)
      .subscribe(r => this.items.set(r));
  }

  add(userId: number, bookId: number, qty: number = 1): void {
    this.http.post<void>('http://localhost:8080/carrello/create', {
      idUtente: userId,
      idLibro: bookId,
      quantita: qty
    }).subscribe(() => this.load(userId));
  }

  updateQuantity(cartItemId: number, qty: number, userId: number): void {
    this.http.put<void>('http://localhost:8080/carrello/update', {
      id: cartItemId,
      quantita: qty
    }).subscribe(() => this.load(userId));
  }

  remove(cartItemId: number, userId: number): void {
    this.http
      .delete<void>(`http://localhost:8080/carrello/delete?id=${cartItemId}`)
      .subscribe(() => this.load(userId));
  }

  clearLocal(): void {
    this.items.set([]);
  }
}