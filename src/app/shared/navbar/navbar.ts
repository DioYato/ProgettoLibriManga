import { Component, inject, computed } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../data/auth.service';
import { AsyncPipe } from '@angular/common';
import { CartService } from '../../data/cart.service';
import { FavoritesService } from '../../data/favorites.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, AsyncPipe],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css',
})
export class Navbar {

  auth = inject(AuthService);
  router = inject(Router);

  logout() {
    this.auth.logout();
  }

  goToProfile() {
    this.router.navigate(['/profilo']);
  }

private readonly cart = inject(CartService);

  readonly cartCount = computed(() =>
  this.cart.all().reduce((sum, item) => sum + item.quantity, 0)
);

constructor(private favorites: FavoritesService) {}

favoritesCount() {
  return this.favorites.count();
}


}

