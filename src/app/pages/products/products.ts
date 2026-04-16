import { DecimalPipe } from '@angular/common';
import { Component, computed, signal, OnInit, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop'; 
import { ProductsService } from '../../data/products.service';
import { Product } from '../../models/product'; 
import { FiltersComponent, ProductFilters } from '../filters/filters.component';
import { FavoritesService } from '../../data/favorites.service';
import { AdminService } from '../../data/admin.service';
import { AuthService } from '../../data/auth.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-products',
  standalone: true,
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
  readonly initialGenre = signal<number | null>(null);
  readonly selectedAuthor = signal<string | null>(null);

  // Mantengo l'oggetto filters per memorizzare lo stato dei filtri (collega)
  filters = {
    types: [] as string[],
    genres: [] as number[]
  };

  private readonly user = toSignal(this.authService.user$, { 
    initialValue: this.authService.getCurrentUser() 
  });

  readonly isModerator = computed(() => this.user()?.ruolo === 'ADMIN');

  // Computed aggiornato per filtrare per ricerca
  readonly products = computed(() => {
    let items = this.productsService.all();
    const q = this.query().trim().toLowerCase();

    if (!q) return items;
    return items.filter((p) => p.titolo.toLowerCase().includes(q));
  });

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      const genereNome = params['genere'];
      const idAutore = params['autore'];

      this.selectedAuthor.set(idAutore || null);

      if (idAutore) {
        this.productsService.loadFromBackend(this.sort(), [], idAutore);
      } 
      else if (genereNome) {
        const idGenere = this.mappaNomeAdId(genereNome);
        // Risolta logica duplicata: carica solo se esiste l'ID, altrimenti carica tutto
        this.productsService.loadFromBackend(this.sort(), idGenere ? [idGenere] : []);
      } 
      else {
        this.productsService.loadFromBackend(this.sort());
      }
    });
  }

  private mappaNomeAdId(nome: string): number | null {
    const mappa: { [key: string]: number } = {
      'classici': 1,
      'fantasy': 2,
      'romanzo storico': 3,
      'narrativa': 4,
      'saggistica': 5,
      'giallo': 6,
      'horror': 7,
      'fantascienza': 8
    };
    return mappa[nome.toLowerCase()] || null;
  }

  deleteProduct(id: number) {
    if (confirm('Sei sicuro di voler eliminare questo prodotto?')) {
      this.adminService.deleteProduct(id).subscribe({
        next: () => this.productsService.loadFromBackend(this.sort(), this.filters.genres, undefined, this.filters.types),
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
    // Passo anche i filtri correnti quando cambio l'ordinamento
    this.productsService.loadFromBackend(value, this.filters.genres, undefined, this.filters.types);
  }

  onFiltersChange(filters: ProductFilters) {
    this.filters = filters;
    this.productsService.loadFromBackend(
      this.sort(),
      filters.genres,
      undefined,
      filters.types 
    );
  }

  imageUrl(copertina?: string) {
    if (!copertina) return 'assets/placeholder.png';
    return `http://localhost:8080/images/${copertina}`;
  }

  isFavorite(id: number) { return this.favorites.isFavorite(id); }
  toggleFavorite(id: number) { this.favorites.toggle(id); }
}