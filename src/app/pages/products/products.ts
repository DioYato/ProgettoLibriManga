import { DecimalPipe } from '@angular/common';
import { Component, computed, signal, OnInit, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ProductsService } from '../../data/products.service';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [DecimalPipe, RouterLink],
  templateUrl: './products.html',
  styleUrl: './products.css',
})
export class Products implements OnInit {

  private readonly productsService = inject(ProductsService);

  readonly query = signal('');
  readonly sort = signal('');

  readonly products = computed(() => {
    const q = this.query().trim().toLowerCase();
    const items = this.productsService.all();

    if (!q) return items;

    return items.filter((p) =>
      p.titolo.toLowerCase().includes(q)
    );
  });

  ngOnInit() {
    this.productsService.loadFromBackend();
  }

  onSearch(value: string) {
    this.query.set(value);
  }

  onSortChange(event: Event) {
  const value = (event.target as HTMLSelectElement)?.value ?? '';
  this.sort.set(value);
  this.productsService.loadFromBackend(value);
}


  imageUrl(copertina?: string) {
    if (!copertina) return '';
    return `http://localhost:8080/images/${copertina}`;
  }
}


