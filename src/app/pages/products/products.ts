import { DecimalPipe } from '@angular/common';
import { Component, computed, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ProductsService } from '../../data/products.service';

@Component({
  selector: 'app-products',
  imports: [DecimalPipe, RouterLink],
  templateUrl: './products.html',
  styleUrl: './products.css',
})
export class Products {
  readonly query = signal('');

  readonly products = computed(() => {
    const q = this.query().trim().toLowerCase();
    const items = this.productsService.all();
    if (!q) return items;
    return items.filter((p) => p.name.toLowerCase().includes(q));
  });

  constructor(private readonly productsService: ProductsService) {}

  onSearch(value: string) {
    this.query.set(value);
  }

}
