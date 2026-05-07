import { DecimalPipe } from '@angular/common';
import { Component, computed, signal, inject, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Product, ProductsService } from '../../services/products.service';
import { CartService } from '../../services/cart.service';
import { AuthService } from '../../services/auth.service';
import { ReviewsComponent } from '../../shared/reviews/reviews';
import { StarRatingComponent } from '../../shared/star-rating/star-rating';

@Component({
  selector: 'app-product-detail',
  imports: [FormsModule, RouterLink, DecimalPipe, ReviewsComponent, StarRatingComponent],
  templateUrl: './product-detail.html',
  styleUrl: './product-detail.css',
})
export class ProductDetail implements OnInit {

  private readonly route = inject(ActivatedRoute);
  private readonly products = inject(ProductsService);
  private readonly cart = inject(CartService);
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);

  readonly tab = signal<'descrizione' | 'dettagli'>('descrizione');

  private readonly id = computed(() => this.route.snapshot.paramMap.get('id'));
  private readonly productSignal = signal<Product | undefined>(undefined);

  readonly product = computed(() => this.productSignal());
  readonly productId = computed(() => this.product()?.id);

  // Quantità come SIGNAL (così aggiorna il prezzo)
  quantity = signal(1);

  // Prezzo totale aggiornato in tempo reale
  readonly totalPrice = computed(() => {
    const p = this.product();
    return p ? p.prezzo * this.quantity() : 0;
  });

  readonly reviewRating = signal(5);

  constructor() {}

  ngOnInit() {
    const id = this.id();
    if (id) {
      this.products.fetchById(id).subscribe(product => {
        this.productSignal.set(product);
      });
    }
  }

  setTab(tab: 'descrizione' | 'dettagli') {
    this.tab.set(tab);
  }

  increaseQty() {
    this.quantity.update(q => q + 1);
  }

  decreaseQty() {
    this.quantity.update(q => Math.max(1, q - 1));
  }

  addToCart() {
    const user = this.auth.user();
    if (!user) {
      alert('Devi effettuare il login per aggiungere prodotti al carrello!');
      this.router.navigate(['/login']);
      return;
    }

    const p = this.product();
    if (!p) return;

    this.cart.add(p, this.quantity());
    alert('Prodotto aggiunto al carrello!');
  }

  scrollToReviews() {
    const target = document.getElementById('reviewsSection');
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

  imageUrl(copertina?: string) {
    if (!copertina) return '';
    return `http://localhost:8080/images/${copertina}`;
  }

  // Determina se è libro o manga
  readonly productType = computed(() => {
    const p = this.product();
    if (!p) return 'Prodotto';

    const categorieArray = (p as any).categorie;
    const isManga = Array.isArray(categorieArray) && categorieArray.some((c: any) =>
      c.categoria?.toLowerCase().includes('manga')
    );

    return isManga ? 'Manga' : 'Libro';
  });

}
