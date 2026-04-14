import { Component, ElementRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router'; // Importa il Router

@Component({
  selector: 'app-generi',
  templateUrl: './section-generi.html',
  styleUrls: ['./section-generi.css']
})
export class GeneriComponent {
  @ViewChild('carousel') carousel!: ElementRef;

  // Assicurati che i nomi corrispondano esattamente a quelli usati nel filtro prodotti
  listaGeneri = [
    { id: 1, name: 'Classici', image: 'classici.jpg' },
    { id: 2, name: 'Fantasy', image: 'Fantasy.jpg' },
    { id: 3, name: 'Romanzo Storico', image: 'clock.jpg' },
    { id: 4, name: 'Narrativa', image: '6-6bb386e6-29a6-40d7-b52a-8bee1d5e38a7.jpg' },
    { id: 5, name: 'Saggistica', image: 'saggistica.jpg' },
    { id: 6, name: 'Giallo', image: '1930s film noir poster.jpg' },
    { id: 7, name: 'Horror', image: 'Ocean of Doom_ Surreal Horror Tentacle Art.jpg' },
    { id: 8, name: 'Fantascienza', image: 'fantascienza.jpg' }
  ];

  constructor(private router: Router) {} // Inietta il router

  // Metodo per navigare e filtrare
  navigaFiltro(nomeGenere: string) {
    this.router.navigate(['/products'], { 
      queryParams: { genere: nomeGenere } 
    });
  }

  scroll(direction: number) {
    const container = this.carousel.nativeElement;
    const scrollAmount = 265; 
    container.scrollBy({ left: direction * scrollAmount, behavior: 'smooth' });
  }
}