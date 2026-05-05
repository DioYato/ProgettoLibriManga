import { DecimalPipe } from '@angular/common';
import { Component, computed, signal, OnInit, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
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
  private readonly route = inject(ActivatedRoute);

  readonly query = signal('');
  readonly sort = signal('');

  readonly itemsPerPage = 20;
  readonly currentPage = signal(1);

  filters = {
    genres: [] as number[]
  };

  private readonly user = inject(AuthService).user;

  readonly isModerator = computed(() => this.user()?.ruolo === 'ADMIN');

  // Il backend restituisce i risultati filtrati e paginati
  readonly products = computed(() => {
    return this.productsService.all();
  });

  readonly totalPages = computed(() => this.productsService.totalPages());
  readonly totalProducts = computed(() => this.productsService.totalProducts());

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      const genereNome = params['genere'];
      const autoreNome = params['autore'];
      const categoriaId = params['categoriaId'];
      const q = params['q'];
      const page = params['page'] ? Number(params['page']) : 1;

      if (q) {
        this.query.set(q);
      }

      this.currentPage.set(page);

      const backendPage = Math.max(0, page - 1);
      const backendQuery = q ? q.trim() : undefined;

      if (autoreNome) {
        this.productsService.loadFromBackend(this.sort(), [], autoreNome, backendQuery, backendPage, this.itemsPerPage);
      }
      else if (categoriaId) {
        this.productsService.loadFromBackend(this.sort(), [Number(categoriaId)], undefined, backendQuery, backendPage, this.itemsPerPage);
      }
      else if (genereNome) {
        const idGenere = this.mappaNomeAdId(genereNome);
        if (idGenere) {
          this.productsService.loadFromBackend(this.sort(), [idGenere], undefined, backendQuery, backendPage, this.itemsPerPage);
        } else {
          this.productsService.loadFromBackend(this.sort(), [], undefined, backendQuery, backendPage, this.itemsPerPage);
        }
      }
      else {
        this.productsService.loadFromBackend(this.sort(), [], undefined, backendQuery, backendPage, this.itemsPerPage);
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
        next: () => this.productsService.loadFromBackend(this.sort(), this.filters.genres, undefined, this.query(), 0, this.itemsPerPage),
        error: (err) => console.error(err)
      });
    }
  }

  onSearch(value: string) {
    this.query.set(value);
    this.currentPage.set(1);
    const backendQuery = value.trim() || undefined;
    this.productsService.loadFromBackend(this.sort(), this.filters.genres, undefined, backendQuery, 0, this.itemsPerPage);
  }

  onSortChange(event: Event) {
    const value = (event.target as HTMLSelectElement)?.value ?? '';
    this.sort.set(value);
    this.currentPage.set(1);
    this.productsService.loadFromBackend(value, this.filters.genres, undefined, this.query(), 0, this.itemsPerPage);
  }

  onFiltersChange(filters: ProductFilters) {
    this.filters = filters;
    this.currentPage.set(1);
    this.productsService.loadFromBackend(
      this.sort(),
      filters.genres,
      undefined,
      this.query(),
      0,
      this.itemsPerPage
    );
  }

  goToPage(page: number) {
    if (page < 1 || page > this.totalPages()) return;
    this.currentPage.set(page);
    this.productsService.loadFromBackend(
      this.sort(),
      this.filters.genres,
      undefined,
      this.query(),
      page - 1,
      this.itemsPerPage
    );
  }

  imageUrl(copertina?: string) {
    if (!copertina) return 'assets/placeholder.png';
    return `http://localhost:8080/images/${copertina}`;
  }

  isFavorite(id: number) { return this.favorites.isFavorite(id); }
  toggleFavorite(id: number) { this.favorites.toggle(id); }
}
