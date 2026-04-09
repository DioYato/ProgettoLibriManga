import { Component, computed, ElementRef, inject, OnInit, ViewChild,  } from '@angular/core';
import { ProductsService } from '../../data/products.service';

@Component({
  selector: 'app-most-wanted',
  imports: [],
  templateUrl: './most-wanted.html',
  styleUrl: './most-wanted.css',
})

export class MostWanted implements OnInit {
  private productsService = inject(ProductsService);

  //view child per abilitare lo scroll del carosello
  @ViewChild('carousel') carousel! : ElementRef;

  // Signal derivato: prende tutti i prodotti e ne restituisce solo 6
  prodottiSample = computed(() => {
    const tutti = this.productsService.all();
    return tutti.slice(0, 6); // Prende i primi 6 elementi
  });

  ngOnInit() {
    // Carica i dati (il servizio aggiornerà il signal 'all')
    this.productsService.loadFromBackend();
   }
   imageUrl(copertina?: string) {
   if (!copertina) return 'assets/placeholder-libro.png';
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

  price_1 = "23,99";

  isDisponibile = true;

}

