import { Component, computed, ElementRef, inject, OnInit, ViewChild,  } from '@angular/core';
import { ProductsService } from '../../data/products.service';
import { Router } from '@angular/router'; // 1. Importa il Router

@Component({
  selector: 'app-libri-storici',
  imports: [],
  templateUrl: './libri-storici.html',
  styleUrl: './libri-storici.css',
})

export class libriStorici implements OnInit {
  private productsService = inject(ProductsService);
  private router = inject(Router); 

  //view child per abilitare lo scroll del carosello
  @ViewChild('carousel') carousel! : ElementRef;

  // --- CONFIGURAZIONE IMMAGINI ---
  // Sostituisci '3000' con la porta effettiva del tuo backend (es. 8080 o 5000)
  // Questo sposta la ricerca da localhost:4200 al tuo vero server
  readonly BACKEND_URL = 'http://localhost:8080'; 
  readonly IMAGE_PATH = '/assets/images/covers';

  // Signal derivato: prende tutti i prodotti e ne restituisce solo 6
  //La funzione computed crea un segnale di sola lettura, Se l'elenco dei prodotti cambia, prodottiSample si ricalcolerà da solo. 
  prodottiSample = computed(() => {
    const tutti = this.productsService.all();
    return tutti.slice(6, 12); // Prende gli indici 6, 7, 8, 9, 10, 11
  });

  ngOnInit() {
    // Carica i dati (il servizio aggiornerà il signal 'all')
    this.productsService.loadFromBackend();
  }

   vaiAlDettaglio(id: number) {
    this.router.navigate(['/products', id]);
  }

  getFullImageUrl(copertina: string): string {
  if (!copertina) return 'assets/placeholder-libro.png';
  
  // Rimuovi eventuali percorsi extra: punta direttamente alla cartella 'images' del backend
  return `http://localhost:8080/images/${copertina}`;
}

  /**
   * Fa scorrere il carosello dei prodotti più cercati verso sinistra o destra.
   * @param direction 1 per scorrere a destra, -1 per scorrere a sinistra
   */
  scroll(direction: number) {
    // Sposta di 400px (o quanto è larga la tua card + gap)
    const direzione=400;

   // nativeElement è l'effettivo div HTML
    this.carousel.nativeElement.scrollBy({
      left: direction * direzione,
      behavior: 'smooth' // Rende lo scorrimento fluido
    });
  }
  



}
