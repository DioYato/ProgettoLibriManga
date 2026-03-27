import { DecimalPipe } from '@angular/common';
import { Component, computed, signal, OnInit, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Product, ProductsService } from '../../data/products.service';
import { FiltersComponent, ProductFilters } from '../filters/filters.component';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [DecimalPipe, RouterLink, FiltersComponent],
  templateUrl: './products.html',
  styleUrl: './products.css',
})
export class Products implements OnInit {

  private readonly productsService = inject(ProductsService);

  readonly query = signal('');
  readonly sort = signal('');

  // Computed: filtra SOLO lato frontend
  readonly products = computed(() => {
    const q = this.query().trim().toLowerCase();
    const items = this.productsService.all(); // dati veri dal backend

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

  // 🔥 FILTRI: chiama il backend con sort + generi
  onFiltersChange(filters: ProductFilters) {
    this.productsService.loadFromBackend(
      this.sort(),
      filters.genres
    );
  }

  imageUrl(copertina?: string) {
    if (!copertina) return '';
    return `http://localhost:8080/images/${copertina}`;
  }
}



