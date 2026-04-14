import { Component, ElementRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router'; // 1. Importa il Router

@Component({
  selector: 'app-card-autori',
  templateUrl: './card-autori.html',
  styleUrl: './card-autori.css'
})
export class CardAutori {
  @ViewChild('containerCarosello') container!: ElementRef;

  constructor(private router: Router) {} // 2. Inietta il Router


  Autori = [
    { id: 1, nome: 'Oscar Wilde', img: 'Oscar-Wilde-1882.png' },
    { id: 2, nome: 'Stephen King', img: 'Stephen_kingo.png' },
    { id: 3, nome: 'J k Rowling', img: 'https://variety.com/wp-content/uploads/2019/12/jk_rowling_v3.png' },
    { id: 4, nome: 'Umberto Eco', img: 'Umberto_eco.png' },
    { id: 5, nome: 'Masashi Kishimoto', img: 'Masashi_Kishimoto.png' },
    { id: 6, nome: 'akira Toriyama', img: 'akira-tori.png' }
  ];

  navigaPerAutore(nomeAutore: string) {
    this.router.navigate(['/products'], { 
      queryParams: { autore: nomeAutore } 
    });
  }


  scroll(direction: number) {
    const cardWidth = 300; // Larghezza card + gap
    this.container.nativeElement.scrollBy({
      left: direction * cardWidth,
      behavior: 'smooth'
    });
  }
}