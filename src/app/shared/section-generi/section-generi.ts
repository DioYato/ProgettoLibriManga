import { Component, computed, ElementRef, inject, OnInit, ViewChild,  } from '@angular/core';
import { ProductsService } from '../../data/products.service';

@Component({
  selector: 'app-section-generi',
  imports: [],
  templateUrl: './section-generi.html',
  styleUrl: './section-generi.css',
})

export class sectionGeneri {
  private productsService = inject(ProductsService);

  //view child per abilitare lo scroll del carosello
  @ViewChild('carousel') carousel! : ElementRef;

  // Array locale dei generi
  // Assicurati che le immagini siano in src/assets/images/generi/
  listaGeneri = [
  { 
    id: 1, name: 'Classici', 
    image: 'https://images.unsplash.com/photo-1589998059171-988d887df646?q=80&w=300&h=550&auto=format&fit=crop' 
  },
  { 
    id: 2, name: 'Fantasy', 
    image: 'https://images.unsplash.com/photo-1618336753974-aae8e04506aa?q=80&w=300&h=550&auto=format&fit=crop' 
  },
  { 
    id: 3, name: 'Romanzo Storico', 
    image: 'https://images.unsplash.com/photo-1464692805480-a69dfaafdb0d?q=80&w=300&h=550&auto=format&fit=crop' 
  },
  { 
    id: 4, name: 'Narrativa', 
    image: 'https://images.unsplash.com/photo-1543004471-240ce44a675f?q=80&w=300&h=550&auto=format&fit=crop' 
  },
  { 
    id: 5, name: 'Saggistica', 
    image: 'https://images.unsplash.com/photo-1532012197267-da84d127e765?q=80&w=300&h=550&auto=format&fit=crop' 
  },
  { 
    id: 6, name: 'Giallo', 
    image: 'https://images.unsplash.com/photo-1595213603417-640167664c39?q=80&w=300&h=550&auto=format&fit=crop' 
  },
  { 
    id: 7, name: 'Horror', 
    image: 'https://images.unsplash.com/photo-1601513445506-2ab0d4fb4229?q=80&w=300&h=550&auto=format&fit=crop' 
  },
  { 
    id: 8, name: 'Fantascienza', 
    image: 'https://images.unsplash.com/photo-1614728263952-84ea206f99b6?q=80&w=300&h=550&auto=format&fit=crop' 
  },
  { 
    id: 9, name: 'Seinen', 
    image: 'https://images.unsplash.com/photo-1613333151271-923f66907405?q=80&w=300&h=550&auto=format&fit=crop' 
  },
  { 
    id: 10, name: 'Shonen', 
    image: 'https://images.unsplash.com/photo-1607171786544-640a08ed5bb8?q=80&w=300&h=550&auto=format&fit=crop' 
  }
];





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
