import { Component } from '@angular/core';
import { Router } from '@angular/router'; // Importa il Router

@Component({
  selector: 'app-newsletter',
  imports: [],
  templateUrl: './newsletter.html',
  styleUrl: './newsletter.css',
})
export class Newsletter {

  constructor (private router : Router) {} // Inietta il Router



  NavigateToLogin() {
    this.router.navigate(['/login']);
  }
}
