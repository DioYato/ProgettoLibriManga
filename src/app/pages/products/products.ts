import { DecimalPipe } from '@angular/common';
import { Component, computed, signal, OnInit, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { ProductsService } from '../../services/products.service';
import { FiltersComponent, ProductFilters } from '../filters/filters.component';
import { FavoritesService } from '../../services/favorites.service';
import { AdminService } from '../../services/admin.service';
import { AuthService } from '../../services/auth.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-products',
  imports: [DecimalPipe, RouterLink, FiltersComponent],
  templateUrl: './products.html',
  styleUrl: './products.css',
})
export class Products implements OnInit {

  private readonly productsService = inject(ProductsService);
  private readonly favorites = inject(FavoritesService);
  private readonly adminService = inject(AdminService);
  private readonly authService = inject(AuthService);
  private readonly route = inject(ActivatedRoute);

  readonly query = signal('');
  readonly sort = signal('');

  filters = {
    genres: [] as number[]
  };

  private readonly user = toSignal(this.authService.user$, {
    initialValue: this.authService.getCurrentUser()
  });

  readonly isModerator = computed(() => this.user()?.ruolo === 'ADMIN');

  readonly products = computed(() => {
    const q = this.query().trim().toLowerCase();
    const items = this.productsService.all();
    if (!q) return items;
    return items.filter((p) => p.titolo.toLowerCase().includes(q));
  });

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      const genereNome = params['genere'];
      const autoreNome = params['autore'];
      const categoriaId = params['categoriaId'];
      const q = params['q'];

      if (q) {
        this.query.set(q);
      }

      if (autoreNome) {
        this.productsService.loadFromBackend(this.sort(), [], autoreNome);
      }
      else if (categoriaId) {
        this.productsService.loadFromBackend(this.sort(), [Number(categoriaId)]);
      }
      else if (genereNome) {
        const idGenere = this.mappaNomeAdId(genereNome);
        if (idGenere) {
          this.productsService.loadFromBackend(this.sort(), [idGenere]);
        } else {
          this.productsService.loadFromBackend(this.sort());
        }
      }
      else {
        this.productsService.loadFromBackend(this.sort());
      }
    });
  }

  private mappaNomeAdId(nome: string): number | null {
    const mappa: { [key: string]: number } = {
      'Classici': 1,
      'Fantasy': 2,
      'Romanzo Storico': 3,
      'Narrativa': 4,
      'Saggistica': 5,
      'Giallo': 6,
      'Horror': 7,
      'Fantascienza': 8
    };
    return mappa[nome.toLowerCase()] || mappa[nome] || null;
  }

  deleteProduct(id: number) {
    if (confirm('Sei sicuro di voler eliminare questo prodotto?')) {
      this.adminService.deleteProduct(id).subscribe({
        next: () => this.productsService.loadFromBackend(this.sort()),
        error: (err) => console.error(err)
      });
    }
  }

  onSearch(value: string) {
    this.query.set(value);
  }

  onSortChange(event: Event) {
    const value = (event.target as HTMLSelectElement)?.value ?? '';
    this.sort.set(value);
    this.productsService.loadFromBackend(value, this.filters.genres, undefined);
  }

  onFiltersChange(filters: ProductFilters) {
    this.filters = filters;
    this.productsService.loadFromBackend(
      this.sort(),
      filters.genres,
      undefined
    );
  }

  imageUrl(copertina?: string) {
    if (!copertina) return 'assets/placeholder.png';
    return `http://localhost:8080/images/${copertina}`;
  }

  isFavorite(id: number) { return this.favorites.isFavorite(id); }
  toggleFavorite(id: number) { this.favorites.toggle(id); }
}
