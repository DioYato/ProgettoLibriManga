import { Routes } from '@angular/router';
import { Home } from './pages/home/home';
import { Products } from './pages/products/products';
import { ProductDetail } from './pages/product-detail/product-detail';
import { Cart } from './pages/cart/cart';
import { Login } from './pages/login/login';
import { MapPage } from './pages/map/map';
import { authGuard } from './guards/auth-guard';
import { adminGuard } from './guards/auth-admin.guard';



export const routes: Routes = [
  { path: '', component: Home },
  { path: 'products', component: Products },
  { path: 'products/:id', component: ProductDetail },
  { path: 'cart', component: Cart, canActivate: [authGuard] },
  { path: 'login', component: Login, data: { mode: 'login' } },
  { path: 'register', component: Login, data: { mode: 'register' } },
  { path: 'mappa', component: MapPage },
  { path: 'preferiti', loadComponent: () => import('./favorites-page/favorites-page').then(m => m.FavoritesPageComponent) },
  { path: 'profilo', canActivate: [authGuard], loadComponent: () => import('./pages/profilo/profilo').then(m => m.Profilo) },
  { path: 'admin', canActivate: [adminGuard], loadComponent: () => import('./pages/admin/admin').then(m => m.Admin) },
  { path: 'admin/prodotti', canActivate: [adminGuard], loadComponent: () => import('./pages/admin-prodotti/admin-prodotti').then(m => m.AdminProdotti) },
  { path: 'ordini-ricevuti', canActivate: [adminGuard], loadComponent: () => import('./pages/ordini-ricevuti/ordini-ricevuti').then(m => m.OrdiniRicevuti) },
  { path: 'ordini-effettuati', canActivate: [authGuard], loadComponent: () => import('./pages/ordini-effettuati/ordini-effettuati').then(m => m.OrdiniEffettuati) },
  {
  path: 'forgot-password',
  loadComponent: () =>
    import('./pages/forgot-password/forgot-password.component')
      .then(m => m.ForgotPasswordComponent)
}


];
