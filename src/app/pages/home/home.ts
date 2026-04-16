import { Component, AfterViewInit, ViewChild, ElementRef, PLATFORM_ID, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { ProductsService } from '../../data/products.service';
import { MostWanted } from "../../shared/most-wanted/most-wanted";
import { CartTipologia } from "../../shared/cart-tipologia/cart-tipologia";
import { CardAutori } from "../../shared/card-autori/card-autori";
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

export class Home implements AfterViewInit {
  private readonly platformId = inject(PLATFORM_ID);

  @ViewChild('koboVideo') vRef!: ElementRef<HTMLVideoElement>;

  constructor(private readonly productsService: ProductsService) {}

  ngAfterViewInit() {
    if (!isPlatformBrowser(this.platformId) || !this.vRef?.nativeElement) {
      return;
    }

    const video = this.vRef.nativeElement;
    video.muted = true;
    video.defaultMuted = true;

    const maybePromise = video.play();
    maybePromise?.catch(() => {
      return;
    });
  }
}
