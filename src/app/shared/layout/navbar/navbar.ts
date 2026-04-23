import { Component, inject, computed } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { AsyncPipe } from '@angular/common';
import { CartService } from '../../../services/cart.service';
import { FavoritesService } from '../../../services/favorites.service';
import { toSignal } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-navbar',
  imports: [RouterLink, AsyncPipe],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css',
})
export class Navbar {

  auth = inject(AuthService);
  router = inject(Router);

  readonly user = toSignal(this.auth.user$, {initialValue: null});
  readonly isAdmin = computed(() => this.user()?.ruolo === 'ADMIN');
  readonly isLoggedNonAdmin = computed(() => !!this.user() && !this.isAdmin());

  private readonly cart = inject(CartService);

  constructor(private favorites: FavoritesService) {}

  logout() {
    this.auth.logout();
  }

  goToProfile() {
    this.router.navigate(['/profilo']);
  }

  readonly cartCount = computed(() =>
    this.cart.all().reduce((sum, item) => sum + item.quantity, 0)
  );

  favoritesCount() {
    return this.favorites.count();
  }

  onSearch(value: string) {
    const q = value.trim();
    if (!q) return;
    this.router.navigate(['/products'], { queryParams: { q } });
  }
}
