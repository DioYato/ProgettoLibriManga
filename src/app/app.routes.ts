import { Routes } from '@angular/router';
import { Home } from './pages/home/home';
import { Products } from './pages/products/products'; 
import { Cart } from './pages/cart/cart';
import { Login } from './pages/login/login';
import { Register } from './pages/register/register';
import { authGuard } from './auth-guard';

export const routes: Routes = [
    { path: '', component: Home },
    { path: 'products', component: Products },
    { path: 'cart', component: Cart },
    { path: 'login', component: Login },
    { path: 'register', component: Register },
    { path: 'cart', component: Cart, canActivate: [authGuard]
}

];
