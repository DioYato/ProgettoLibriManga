

import { DecimalPipe } from '@angular/common';
import { Component, computed, signal, OnInit, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop'; 

// 1. Product è in models, ProductsService è in data. Van divisi:
import { ProductsService } from '../../data/products.service';
import { Product } from '../../models/product'; 

// 2. Controlla se FiltersComponent è davvero in questa cartella (nello screen non lo vedo)
// Se ti dà ancora errore qui, prova a scriverlo a mano e lascia che VS Code ti suggerisca il percorso
import { FiltersComponent, ProductFilters } from '../filters/filters.component';

import { FavoritesService } from '../../data/favorites.service';
import { AdminService } from '../../data/admin.service';
import { AuthService } from '../../data/auth.service';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [DecimalPipe, RouterLink, FiltersComponent],
  templateUrl: './products.html',
  styleUrl: './products.css',
})
export class Products implements OnInit {
  // Il resto del codice che ti ho dato prima rimane identico
  private readonly productsService = inject(ProductsService);
  private readonly favorites = inject(FavoritesService);
  private readonly adminService = inject(AdminService);
  private readonly authService = inject(AuthService);

  readonly query = signal('');
  readonly sort = signal('');

  private readonly user = toSignal(this.authService.user$, { 
    initialValue: this.authService.getCurrentUser() 
  });

  readonly isModerator = computed(() => this.user()?.ruolo === 'MODERATOR');

  readonly products = computed(() => {
    const q = this.query().trim().toLowerCase();
    const items = this.productsService.all(); 
    if (!q) return items;
    return items.filter((p) => p.titolo.toLowerCase().includes(q));
  });

  ngOnInit() {
    this.productsService.loadFromBackend();
  }

  deleteProduct(id: number) {
    if (confirm('Sei sicuro di voler eliminare questo prodotto?')) {
      this.adminService.deleteProduct(id).subscribe({
        next: () => this.productsService.loadFromBackend(this.sort()),
        error: (err) => console.error(err)
      });
    }
  }

  onSearch(value: string) { this.query.set(value); }

  onSortChange(event: Event) {
    const value = (event.target as HTMLSelectElement)?.value ?? '';
    this.sort.set(value);
    this.productsService.loadFromBackend(value);
  }

  onFiltersChange(filters: ProductFilters) {
    this.productsService.loadFromBackend(this.sort(), filters.genres);
  }

  imageUrl(copertina?: string) {
    if (!copertina) return 'assets/placeholder.png';
    return `http://localhost:8080/images/${copertina}`;
  }

  isFavorite(id: number) { return this.favorites.isFavorite(id); }
  toggleFavorite(id: number) { this.favorites.toggle(id); }
}