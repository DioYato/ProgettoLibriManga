import { DecimalPipe } from '@angular/common';
import { Component, computed, signal, inject, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ProductsService } from '../../data/products.service';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [RouterLink, DecimalPipe],
  templateUrl: './product-detail.html',
  styleUrl: './product-detail.css',
})
export class ProductDetail implements OnInit {

  private readonly route = inject(ActivatedRoute);
  private readonly products = inject(ProductsService);

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
    alert('Aggiunto al carrello (mock)');
  }
}


