import { Component, AfterViewInit, ViewChild, ElementRef, PLATFORM_ID, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { ProductsService } from '../../services/products.service';
import { MostWanted } from "../../shared/sections/most-wanted/most-wanted";
import { CartTipologia } from "../../shared/sections/cart-tipologia/cart-tipologia";
import { CardAutori } from "../../shared/cards/card-autori/card-autori";
import { CarouselHeroComponent } from "../../shared/sections/carousel-hero/carosello";
import { Spedizioni } from '../../shared/cards/cards-18pp/spedizioni/spedizioni';
import { libriStorici } from '../../shared/sections/libri-storici/libri-storici';
import { MangaSectionComponent } from '../../shared/sections/libri-manga/libri-manga';
import {GeneriComponent } from "../../shared/sections/generi/section-generi";
import { Newsletter } from "../../shared/sections/newsletter/newsletter";
import { MiniChatbotComponent } from "../../mini-chatbot/mini-chatbot";

@Component({
  selector: 'app-home',
  imports: [CarouselHeroComponent, MostWanted, CartTipologia, CardAutori, Spedizioni, libriStorici, MangaSectionComponent, Newsletter, GeneriComponent, MiniChatbotComponent],
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
