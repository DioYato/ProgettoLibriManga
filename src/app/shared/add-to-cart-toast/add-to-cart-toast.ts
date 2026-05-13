import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

interface CartToastItem {
  title: string;
  price: number;
  qty: number;
  image: string;
}

@Component({
  selector: 'app-add-to-cart-toast',
  imports: [CommonModule],
  templateUrl: './add-to-cart-toast.html',
  styleUrl: './add-to-cart-toast.css'
})
export class AddToCartToastComponent {

  @Input() items: CartToastItem[] = [];
  @Input() subtotal = 0;
  @Input() shipping = 0;
  @Input() total = 0;
  @Input() missingForFree = 0;

  @Output() checkout = new EventEmitter<void>();

  visible = false;

  open() {
    this.visible = true;
  }

  close() {
    this.visible = false;
  }

  proceedToCheckout() {
    this.checkout.emit();
    this.close();
  }
}