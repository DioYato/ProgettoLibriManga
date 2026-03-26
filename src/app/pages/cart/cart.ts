import { Component, computed, inject } from '@angular/core';
import { CartService } from '../../data/cart.service';

@Component({
  selector: 'app-cart',
  standalone: true,
  templateUrl: './cart.html',
  styleUrl: './cart.css',
})
export class CartComponent {

  private readonly cart = inject(CartService);

  readonly items = computed(() => this.cart.all());
  readonly total = computed(() => this.cart.total());
}
