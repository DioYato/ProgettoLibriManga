import { Component, computed, signal } from '@angular/core';
import { ProductsService } from '../../data/products.service';
import { MostWanted } from "../../shared/most-wanted/most-wanted";
import { CartTipologia } from "../../shared/cart-tipologia/cart-tipologia";
import { CardAutori } from "../../shared/card-autori/card-autori"; // Corretto nome classe
import { CarouselHeroComponent } from "../../shared/carosello/carosello";
import { Spedizioni } from '../../shared/cards-18pp/spedizioni/spedizioni';
import { PromotionSection } from "../../shared/promotion-section/promotion-section";
import { libriStorici } from '../../shared/libri-storici/libri-storici';
import { MangaSectionComponent } from '../../shared/libri-manga/libri-manga';
import { sectionGeneri } from "../../shared/section-generi/section-generi";
import { Newsletter } from "../../shared/newsletter/newsletter";

@Component({
  selector: 'app-home',
  imports: [CarouselHeroComponent, MostWanted, CartTipologia, CardAutori, Spedizioni,  libriStorici, MangaSectionComponent, sectionGeneri, Newsletter],
  templateUrl: './home.html',
  styleUrl: './home.css',
})

export class Home {
  readonly featured = computed(() => this.productsService.all().slice(8, 12));

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

  const out: T[][] = [];
  for (let i = 0; i < items.length; i += size) out.push(items.slice(i, i + size));
  return out;
}



