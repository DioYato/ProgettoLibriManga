import { Component, inject, signal } from '@angular/core';
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

  isLogged = signal(false); 

  constructor() {
    this.router.events.subscribe(() => this.updateState());
    this.updateState();
  }

  updateState() {
    if (typeof window !== 'undefined') {
      this.isLogged.set(!!localStorage.getItem('token'));
    }
  }

  logout() {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('token');
    }
    this.updateState();
    this.router.navigate(['/']);
  }
}



