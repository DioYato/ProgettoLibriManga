import { Component, computed, ElementRef, inject, OnInit, ViewChild,  } from '@angular/core';
import { ProductsService } from '../../data/products.service';
import { Router } from '@angular/router'; 

@Component({
  selector: 'app-libri-storici',
  imports: [],
  templateUrl: './libri-storici.html',
  styleUrl: './libri-storici.css',
})

export class libriStorici implements OnInit {
  private productsService = inject(ProductsService);
  private router = inject(Router); 

  @ViewChild('carousel') carousel! : ElementRef;


  readonly BACKEND_URL = 'http://localhost:8080'; 
  readonly IMAGE_PATH = '/assets/images/covers';

  prodottiSample = computed(() => {
    const tutti = this.productsService.all();
    return tutti.slice(6, 12); 
  });

  ngOnInit() {
    this.productsService.loadFromBackend();
  }

   vaiAlDettaglio(id: number) {
    this.router.navigate(['/products', id]);
  }

  getFullImageUrl(copertina: string): string {
  if (!copertina) return 'assets/placeholder-libro.png';
  
  return `http://localhost:8080/images/${copertina}`;
}

  /**
   * Fa scorrere il carosello dei prodotti più cercati verso sinistra o destra.
   * @param direction 1 per scorrere a destra, -1 per scorrere a sinistra
   */
  scroll(direction: number) {
    const direzione=400;

    this.carousel.nativeElement.scrollBy({
      left: direction * direzione,
      behavior: 'smooth' 
    });
  }
  



}
