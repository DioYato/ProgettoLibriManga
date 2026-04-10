import { Component, computed, ElementRef, inject, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductsService } from '../../data/products.service';

@Component({
  selector: 'app-manga-section',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './libri-manga.html',
  styleUrl: './libri-manga.css',
})
export class MangaSectionComponent implements OnInit {
  private productsService = inject(ProductsService);

  @ViewChild('carousel') carousel!: ElementRef;

  // Filtriamo i prodotti per categoria (es. ID 21-27 o categoria 'Manga')
  mangaList = computed(() => {
    const tutti = this.productsService.all();
    // Filtriamo i prodotti che hanno l'autore o l'ID nel range dei manga inseriti
    return tutti.filter(p => p.id >= 21 && p.id <= 27);
  });

  ngOnInit() {
    this.productsService.loadFromBackend();
  }

  scroll(direction: number) {
    const scrollAmount = 320; // Larghezza card + gap
    this.carousel.nativeElement.scrollBy({
      left: direction * scrollAmount,
      behavior: 'smooth'
    });
  }
}