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

  // Testo della ricerca
  readonly query = signal('');

  // Lista prodotti filtrata
  readonly products = computed(() => {
    const q = this.query().trim().toLowerCase();
    const items = this.productsService.all(); // <-- ora vengono dal backend

    if (!q) return items;

    // ATTENZIONE: ora il backend manda "titolo", non "name"
    return items.filter((p) =>
      p.titolo.toLowerCase().includes(q)
    );
  });

  ngOnInit() {
    // Carica i prodotti dal backend
    this.productsService.loadFromBackend();
  }

  onSearch(value: string) {
    this.query.set(value);
  }

  imageUrl(copertina?: string) {
    if (!copertina) {
      return ''
    }
    return `http://localhost:8080/images/${copertina}`;
  }
}

