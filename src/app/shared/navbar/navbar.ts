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

  /**
   * Tiene traccia di se l'utente è loggato o no.
   * Usato per mostrare/nascondere il pulsante di logout nella barra di navigazione.
   */
  isLogged = signal(false);

  /**
   * Router iniettato tramite inject() (Angular moderno)
   */
  router = inject(Router);

  constructor() {
    /**
     * Ascolta i cambiamenti di rotta e aggiorna lo stato del login.
     * Utile per sincronizzare la UI quando l'utente naviga tra le pagine.
     */
    this.router.events.subscribe(() => this.updateState());
    this.updateState();
  }

  /**
   * Controlla se il token è presente nel browser (significa che l'utente è loggato)
   * e aggiorna la variabile isLogged di conseguenza.
   */
  updateState() {
    if (typeof window !== 'undefined') {
      this.isLogged.set(!!localStorage.getItem('token'));
    }
  }

  /**
   * Disconnette l'utente:
   * - Rimuove il token dal browser
   * - Aggiorna lo stato della barra di navigazione
   * - Reindirizza alla homepage
   */
  logout() {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('token');
    }
    this.updateState();
    this.router.navigate(['/']);
  }
}


