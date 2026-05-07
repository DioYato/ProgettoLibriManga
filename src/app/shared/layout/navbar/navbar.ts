import { Component, computed, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { CartService } from '../../../services/cart.service';
import { FavoritesService } from '../../../services/favorites.service';

@Component({
  selector: 'app-navbar',
  imports: [RouterLink],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css',
})
export class Navbar {

  auth = inject(AuthService);
  router = inject(Router);

  readonly user = this.auth.user
  readonly isAdmin = computed(() => this.user()?.ruolo === 'ADMIN');
  readonly isLoggedNonAdmin = computed(() => !!this.user() && !this.isAdmin());

  private readonly cart = inject(CartService);

  readonly cartCount = this.cart.count;

  constructor(private favorites: FavoritesService) {}

  logout() {
    this.auth.logout();
  }

  goToProfile() {
    this.router.navigate(['/profilo']);
  }

  favoritesCount() {
    return this.favorites.count();
  }

  onSearch(value: string) {
    const q = value.trim();
    if (!q) return;
    this.router.navigate(['/products'], { queryParams: { q } });
  }

  imageUrl(fileName: string) {
    return 'http://localhost:8080/images/' + fileName;
  }
}
