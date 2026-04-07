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

  


  prodotti = [
    {
      id: 1,
      img: "https://media.mondadoristore.it/picture/978882970880/01/NZO",
      title: 'Il Mistero del Codice',
      autore: 'Luca Bianchi',
      prezzo: this.price_1,
      quantita: 2,
      prezzo_scontato: "11.99",
      sconto: "4%"
    },
    {
      id: 2,
      img: "https://media.mondadoristore.it/picture/978882279787/01/NZO",
      title: 'Oltre l’Orizzonte',
      autore: 'Giulia Verdi',
      quantita: 2,
      prezzo: "12,99",
      prezzo_scontato: "11,40",
      sconto: "5%"
    },
    {
      id: 3,
      img: "https://media.mondadoristore.it/picture/978883894897/01/NZO",
      title: 'Sussurri nel Vento',
      autore: 'Marco Neri',
      quantita: 0,
      prezzo: 18.0,
      prezzo_scontato: 8.40,
      sconto: "7%"
    },
    {
      id: 4,
      img: "https://media.mondadoristore.it/picture/978880480726/01/NZO",
      title: 'L’Ultima Alchimia',
      autore: 'Elena Rossi',
      quantita: 4,
      prezzo: 50,
      prezzo_scontato: "31,50",
      sconto: "8%"
    },
    {
      id: 5,
      img: 'https://picsum.photos/700/500?random=4',
      title: 'L’Ultima Alchimia',
      autore: 'Elena Rossi',
      quantita: 0,
      prezzo: 40.0,
      prezzo_scontato:"20,99",
      sconto: "10%"
    },
    {
      id: 6,
      img: 'https://picsum.photos/700/500?random=4',
      title: 'L’Ultima Alchimia',
      autore: 'Elena Rossi',
      quantita: 0,
      prezzo: 21.0,
      prezzo_scontato: "11,40",
      sconto: "4%"
    },
  ];

  



}
