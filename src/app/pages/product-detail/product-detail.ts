import { DecimalPipe } from '@angular/common';
import { Component, computed, signal, inject, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Product, ProductsService } from '../../services/products.service';
import { CartService } from '../../services/cart.service';
import { AuthService } from '../../services/auth.service';
import { ReviewsComponent } from '../../shared/reviews/reviews';
import { StarRatingComponent } from '../../shared/star-rating/star-rating';
import { ReviewsService, Review } from '../../services/reviews.service'; // Aggiunta importazione
import { App } from '../../app';


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
  private readonly reviewsService = inject(ReviewsService); // Iniezione del servizio recensioni
  private readonly app = inject(App); 

  readonly tab = signal<'descrizione' | 'dettagli'>('descrizione');

  private readonly id = computed(() => this.route.snapshot.paramMap.get('id'));
  private readonly productSignal = signal<Product | undefined>(undefined);
  
  // Nuovo segnale per contenere l'elenco reale delle recensioni
  private readonly productReviews = signal<Review[]>([]);

  readonly product = computed(() => this.productSignal());
  readonly productId = computed(() => this.product()?.id);

  // LOGICA RECENSIONI DINAMICA
  readonly reviewCount = computed(() => this.productReviews().length);
  
  readonly reviewRating = computed(() => {
    const list = this.productReviews();
    if (list.length === 0) return 0;
    const sum = list.reduce((acc, curr) => acc + (curr.stelle || 0), 0);
    return sum / list.length;
  });

  quantity = signal(1);

  readonly totalPrice = computed(() => {
    const p = this.product();
    return p ? p.prezzo * this.quantity() : 0;
  });

  userVote = signal(5);

  private userId: number | null = null;

  private selectedProduct: Product | null = null;

  constructor() {
    const stored = localStorage.getItem('user');
    if (stored) {
      const user = JSON.parse(stored);
      this.userId = user.id;
    }
  }

  ngOnInit() {
    this.loadProductData();
  }

  loadProductData() {
  const id = this.id();
  if (id) {
    // 1. Carica i dati base del prodotto
    this.products.fetchById(id).subscribe(product => {
      this.productSignal.set(product);
    });

    // 2. Carica (o ricarica) le recensioni
    // Quando questo Signal cambia, reviewCount() e reviewRating() si aggiornano all'istante
    this.reviewsService.getByProduct(Number(id)).subscribe(reviews => {
      this.productReviews.set(reviews || []);
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
    if (!this.userId) {
      this.router.navigate(['/login']);
      return;
    }

    const p = this.product();
    if (!p) return;

    this.selectedProduct = p;

    let existingItem = null;
    for (const item of this.cart.all()) {
      if (item.libro.id === p.id) {
        existingItem = item;
        break;
      }
    }

    if (existingItem === null) {
      this.cart.add(this.userId, this.selectedProduct.id, this.quantity());
    } else {
      this.cart.updateQuantity(existingItem.id, existingItem.quantita + this.quantity(), this.userId);
    }

    this.app.sideCart.items = [{
      title: p.titolo,
      price: p.prezzo,
      qty: this.quantity(),
      image: this.imageUrl(p.copertina)
    }];

    this.app.sideCart.subtotal = p.prezzo * this.quantity();
    this.app.sideCart.shipping = 5.50;
    this.app.sideCart.total = this.app.sideCart.subtotal + this.app.sideCart.shipping;
    this.app.sideCart.missingForFree = Math.max(0, 40 - this.app.sideCart.total);

    this.app.checkoutHandler = () => {
      if (!this.userId || !this.selectedProduct) return;
      this.router.navigate(['/cart']);
    };

    this.app.sideCart.open();
  }

  scrollToReviews() {
    const target = document.getElementById('reviewsSection');
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

  imageUrl(copertina?: string) {
    return copertina ? `http://localhost:8080/images/${copertina}` : 'assets/placeholder.png';
  }

  readonly productType = computed(() => {
    const p = this.product();
    if (!p) return 'Prodotto';

    const categorieArray = (p as any).categorie;
    const isManga = Array.isArray(categorieArray) &&
      categorieArray.some((c: any) => c.categoria?.toLowerCase().includes('manga'));

    return isManga ? 'Manga' : 'Libro';
  });

}