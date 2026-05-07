import { Component, ElementRef, inject, OnInit, signal, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Product, ProductsService } from '../../../services/products.service';
import { Router } from '@angular/router'; 

@Component({
  selector: 'app-manga-section',
  imports: [CommonModule],
  templateUrl: './libri-manga.html',
  styleUrl: './libri-manga.css',
})
export class MangaSectionComponent implements OnInit {
  private productsService = inject(ProductsService);
  private router = inject(Router); 

  @ViewChild('carousel') carousel!: ElementRef;

  mangaList = signal<Product[]>([]);
  
  ngOnInit() {
    this.productsService.fetchFromBackend('annoDesc', [10]).subscribe(manga => {
      this.mangaList.set(manga);
    });
  }

  vaiAlDettaglio(id: number) {
    this.router.navigate(['/products', id]);
  }

   imageUrl(copertina?: string) {
   if (!copertina) return 'assets/placeholder-libro.png';
   return `http://localhost:8080/images/${copertina}`;
   }

  scroll(direction: number) {
    const scrollAmount = 320; 
    this.carousel.nativeElement.scrollBy({
      left: direction * scrollAmount,
      behavior: 'smooth'
    });
  }
}