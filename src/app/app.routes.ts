import { Routes } from '@angular/router';
import { Home } from './pages/home/home';
import { Products } from './pages/products/products';
import { ProductDetail } from './pages/product-detail/product-detail';
import { Cart } from './pages/cart/cart';
import { Login } from './pages/login/login';
import { MapPage } from './pages/map/map';
import { authGuard } from './auth-guard';

export const routes: Routes = [
  { path: '', component: Home },
  { path: 'products', component: Products },
  { path: 'products/:id', component: ProductDetail },
  { path: 'cart', component: Cart, canActivate: [authGuard] },
  { path: 'login', component: Login, data: { mode: 'login' } },
  { path: 'register', component: Login, data: { mode: 'register' } },
  { path: 'mappa', component: MapPage },
  {path: 'profilo', canActivate: [authGuard], loadComponent: () => import('./pages/profilo/profilo').then(m => m.Profilo)},
  {path: 'preferiti', loadComponent: () => import('./favorites-page/favorites-page').then(m => m.FavoritesPageComponent)}
];



