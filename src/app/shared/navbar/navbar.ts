import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../data/auth.service';
import { AsyncPipe } from '@angular/common';

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
}

