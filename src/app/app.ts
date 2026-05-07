import { Component, ViewChild } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Navbar } from "./shared/layout/navbar/navbar";
import { Footer } from './shared/layout/footer/footer';
import { MiniChatbotComponent } from './mini-chatbot/mini-chatbot';
import { AddToCartToastComponent } from './shared/add-to-cart-toast/add-to-cart-toast';

@Component({
  selector: 'app-root',
  imports: [
    RouterOutlet,
    Navbar,
    Footer,
    MiniChatbotComponent,
    AddToCartToastComponent
  ],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {

  @ViewChild('toast')
  sideCart!: AddToCartToastComponent;

  checkoutHandler: (() => void) | null = null;

  onCheckout() {
    this.checkoutHandler?.();
    this.checkoutHandler = null;
  }
}
