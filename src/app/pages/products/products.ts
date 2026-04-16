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
<<<<<<< HEAD
  readonly initialGenre = signal<number | null>(null);

  // 🔥 FILTRI COMPLETI
  filters = {
    types: [] as string[],
    genres: [] as number[]
  };
=======
  readonly initialGenre = signal<number | null>(null); 
  readonly selectedAuthor = signal<string | null>(null); // Aggiungi questo signal
>>>>>>> d7eb50aaf7971c9040c88cdabdbc2be390bd3c4e

  private readonly user = toSignal(this.authService.user$, { 
    initialValue: this.authService.getCurrentUser() 
  });

  readonly isModerator = computed(() => this.user()?.ruolo === 'ADMIN');

  /*
  readonly products = computed(() => {
    const q = this.query().trim().toLowerCase();
    const items = this.productsService.all(); 
    if (!q) return items;
    return items.filter((p) => p.titolo.toLowerCase().includes(q));
  });

<<<<<<< HEAD
  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      const genereNome = params['genere'];
      const autoreNome = params['autore'];

      if (autoreNome) {
=======
  */

  readonly products = computed(() => {
    let items = this.productsService.all();
    const q = this.query().trim().toLowerCase();
    const authorFilter = this.selectedAuthor();

    // 1. Filtro per Autore (se il signal è valorizzato)
    if (authorFilter) {
      const filterLower = authorFilter.toLowerCase();
      items = items.filter(p => {
        // Uniamo nome e cognome per il confronto
        const nomeCompleto = `${p.autore.nome} ${p.autore.cognome}`.toLowerCase();
        return nomeCompleto.includes(filterLower);
      });
    }

    // 2. Filtro per Ricerca testuale
    if (!q) return items;
    return items.filter((p) => p.titolo.toLowerCase().includes(q));
  });


ngOnInit() {
    this.route.queryParams.subscribe(params => {
      const genereNome = params['genere'];
      const autoreNome = params['autore'];

      // Aggiorna il signal dell'autore (così il computed reagisce)
      this.selectedAuthor.set(autoreNome || null);

      if (autoreNome) {
        // Chiamata al backend per caricare i dati filtrati dal server
>>>>>>> d7eb50aaf7971c9040c88cdabdbc2be390bd3c4e
        this.productsService.loadFromBackend(this.sort(), [], autoreNome);
      } 
      else if (genereNome) {
        const idGenere = this.mappaNomeAdId(genereNome);
<<<<<<< HEAD
        if (idGenere) {
          this.productsService.loadFromBackend(this.sort(), [idGenere]);
        } else {
          this.productsService.loadFromBackend(this.sort());
        }
=======
        this.productsService.loadFromBackend(this.sort(), idGenere ? [idGenere] : []);
>>>>>>> d7eb50aaf7971c9040c88cdabdbc2be390bd3c4e
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
    this.productsService.loadFromBackend(value, this.filters.genres, undefined, this.filters.types);
  }

  // 🔥 ECCO LA FUNZIONE CORRETTA
  onFiltersChange(filters: ProductFilters) {
    this.filters = filters;
    this.productsService.loadFromBackend(
      this.sort(),
      filters.genres,
      undefined,
      filters.types   // ⬅⬅⬅ AGGIUNTO
    );
  }

  imageUrl(copertina?: string) {
    if (!copertina) return 'assets/placeholder.png';
    return `http://localhost:8080/images/${copertina}`;
  }

  isFavorite(id: number) { return this.favorites.isFavorite(id); }
  toggleFavorite(id: number) { this.favorites.toggle(id); }
}
