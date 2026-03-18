import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css',
})
export class Navbar {

  private router = inject(Router);

  isLogged = false;

  constructor() {
    this.updateState();
  }

  updateState() {
    this.isLogged = !!localStorage.getItem('token');
  }

  logout() {
    localStorage.removeItem('token');
    this.updateState();
    this.router.navigate(['/']);
  }
}
