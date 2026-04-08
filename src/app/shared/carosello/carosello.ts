import { Component, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common'; // Importante per [class.active]

@Component({
  selector: 'app-carousel-hero',
  imports: [CommonModule],
  templateUrl: './carosello.html',
  styleUrl: './carosello.css'
})
export class CarouselHeroComponent {
  @ViewChild('carousel') carousel!: ElementRef;

  currentIndex = 0;
  totalSlides = 3;

  // Questa funzione sposta FISICAMENTE il binario e tiene l'indice aggiornato
  goToSlide(index: number) {
    this.currentIndex = index;
    const track = this.carousel.nativeElement.querySelector('.carousel-track');
    const percentage = this.currentIndex * 100;
    track.style.transform = `translateX(-${percentage}%)`;
  }

  // Questa funzione gestisce il calcolo +1 / -1
  move(direction: number) {
    this.currentIndex += direction;

    // Logica di loop infinito
    if (this.currentIndex >= this.totalSlides) {
      this.currentIndex = 0;
    } else if (this.currentIndex < 0) {
      this.currentIndex = this.totalSlides - 1;
    }

    this.goToSlide(this.currentIndex);
  }
}