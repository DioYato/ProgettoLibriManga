import { Component, computed, signal } from '@angular/core';
import { ProductsService } from '../../data/products.service';
import { MostWanted } from "../../shared/most-wanted/most-wanted";
import { CartTipologia } from "../../shared/cart-tipologia/cart-tipologia";
import { CardAutori } from "../../shared/card-autori/card-autori"; // Corretto nome classe
import { CarouselHeroComponent } from "../../shared/carosello/carosello";
import { Spedizioni } from '../../shared/cards-18pp/spedizioni/spedizioni';
import { libriStorici } from '../../shared/libri-storici/libri-storici';
import { MangaSectionComponent } from '../../shared/libri-manga/libri-manga';
import {GeneriComponent } from "../../shared/section-generi/section-generi";
import { Newsletter } from "../../shared/newsletter/newsletter";

@Component({
  selector: 'app-home',
  imports: [CarouselHeroComponent, MostWanted, CartTipologia, CardAutori, Spedizioni, libriStorici, MangaSectionComponent, Newsletter, GeneriComponent],
  templateUrl: './home.html',
  styleUrl: './home.css',
})

export class Home {
  readonly featured = computed(() => this.productsService.all().slice(8, 12));

  constructor(private readonly productsService: ProductsService) {}
}

function chunk<T>(items: T[], size: number) {

  const out: T[][] = [];
  for (let i = 0; i < items.length; i += size) out.push(items.slice(i, i + size));
  return out;
}



