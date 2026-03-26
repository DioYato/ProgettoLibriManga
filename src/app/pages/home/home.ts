import { Component, computed, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ProductsService } from '../../data/products.service';
import { Carosello } from "../../shared/carosello/carosello";
import { MostWanted } from "../../shared/most-wanted/most-wanted";
import { CardRettangolo } from "../../shared/card-rettangolo/card-rettangolo";
import { CartServizi } from "../../shared/cart-servizi/cart-servizi";
import { CartTipologia } from "../../shared/cart-tipologia/cart-tipologia";

@Component({
  selector: 'app-home',
  imports: [RouterLink, Carosello, MostWanted, CardRettangolo, CartServizi, CartTipologia],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home {
  // Mock: in futuro questi dati arriveranno dal backend.
  readonly featured = computed(() => this.productsService.all().slice(8, 12));

  // Mock: in futuro questi dati arriveranno dal backend.
  readonly authors = [
    { name: 'Autore 1', img: 'https://picsum.photos/700/500?random=author1' },
    { name: 'Autore 2', img: 'https://picsum.photos/700/500?random=author2' },
    { name: 'Autore 3', img: 'https://picsum.photos/700/500?random=author3' },
    { name: 'Autore 4', img: 'https://picsum.photos/700/500?random=author4' },
    { name: 'Autore 5', img: 'https://picsum.photos/700/500?random=author5' },
    { name: 'Autore 6', img: 'https://picsum.photos/700/500?random=author6' },
    { name: 'Autore 7', img: 'https://picsum.photos/700/500?random=author7' },
    { name: 'Autore 8', img: 'https://picsum.photos/700/500?random=author8' },
  ];

  readonly authorSlideIndex = signal(0);
  readonly authorSlides = computed(() => chunk(this.authors, 4));
  readonly authorSlideCount = computed(() => this.authorSlides().length);

  /**
   * Navigazione del carosello.
   *
   * Migrazione backend:
   * - Sostituisci `authors` con dati API (es. GET `/api/authors/trending`)
   * - La logica del carosello resta identica: serve solo un array di `{ name, img }`
   */

  prevAuthors() {
    const count = this.authorSlideCount();
    if (count <= 1) return;
    const next = (this.authorSlideIndex() - 1 + count) % count;
    this.authorSlideIndex.set(next);
  }

  nextAuthors() {
    const count = this.authorSlideCount();
    if (count <= 1) return;
    const next = (this.authorSlideIndex() + 1) % count;
    this.authorSlideIndex.set(next);
  }

  setAuthorSlide(i: number) {
    const count = this.authorSlideCount();
    const clamped = Math.max(0, Math.min(i, count - 1));
    this.authorSlideIndex.set(clamped);
  }

  constructor(private readonly productsService: ProductsService) {}
}

function chunk<T>(items: T[], size: number) {
  // Utility per spezzare un array in "slide" di dimensione fissa per il carosello.
  // Tenerla pura semplifica un eventuale refactor o test.
  const out: T[][] = [];
  for (let i = 0; i < items.length; i += size) out.push(items.slice(i, i + size));
  return out;
}



