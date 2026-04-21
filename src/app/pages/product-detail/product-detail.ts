import { DecimalPipe } from '@angular/common';
import { Component, computed, signal, inject, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink, Router } from '@angular/router';
import { ProductsService } from '../../services/products.service';
import { CartService } from '../../services/cart.service';
import { AuthService } from '../../services/auth.service';


@Component({
  selector: 'app-product-detail',
  imports: [RouterLink, DecimalPipe],
  templateUrl: './product-detail.html',
  styleUrl: './product-detail.css',
})
export class ProductDetail implements OnInit {

  private readonly route = inject(ActivatedRoute);
  private readonly products = inject(ProductsService);
  private readonly cart = inject(CartService);
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);

  readonly tab = signal<'descrizione' | 'dettagli'>('descrizione');

  // ID preso dalla rotta
  private readonly id = computed(() => this.route.snapshot.paramMap.get('id'));

  // Prodotto ottenuto dal service
  readonly product = computed(() => this.products.getById(this.id()));

  constructor() {}

  ngOnInit() {
    // Carica i prodotti dal backend se non sono già presenti
    this.products.loadFromBackend();
  }

  setTab(tab: 'descrizione' | 'dettagli') {
    this.tab.set(tab);
  }

  addToCart() {
    const user = this.auth.getCurrentUser();
    if (!user) {
      alert('Devi effettuare il login per aggiungere prodotti al carrello!');
      this.router.navigate(['/login']);
      return;
    }

    const p = this.product();
    if (!p) return;

    this.cart.add(p);
    alert('Prodotto aggiunto al carrello!');
  }

  imageUrl(copertina?: string) {
    if (!copertina) {
      return ''
    }
    return `http://localhost:8080/images/${copertina}`;
  }

}


