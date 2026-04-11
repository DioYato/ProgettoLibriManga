import { Component, ElementRef, ViewChild } from '@angular/core';

@Component({
  selector: 'app-card-autori',
  templateUrl: './card-autori.html',
  styleUrl: './card-autori.css'
})
export class CardAutori {
  @ViewChild('containerCarosello') container!: ElementRef;

  Autori = [
    { id: 1, nome: 'Alberto Angela', img: 'https://archeosticker.com/assets/img/stickers/21_AlbertoAngela.png' },
    { id: 2, nome: 'stephen King', img: 'https://cdn.prod.website-files.com/63d2e5c935189c740b46adfe/64652d4902efb61acfc91af7_Copy%2Bof%2BCopy%2Bof%2BUntitled%2B%252834%2529.png' },
    { id: 3, nome: 'J k Rowling', img: 'https://variety.com/wp-content/uploads/2019/12/jk_rowling_v3.png' },
    { id: 4, nome: 'Aldo Cazzullo', img: 'https://mondadoristore-cdn.thron.com/delivery/public/image/mondadoristore/5a7c04d7-f536-47d9-b92e-5d013d4fb325/mxetsm/std/310x278/cazzullo-slidercard_btitolo_autori' },
    { id: 5, nome: 'Alessandro Barbero', img: 'percorso/barbero.png' },
    { id: 6, nome: 'Eichiro Oda', img: '' }
  ];

  scroll(direction: number) {
    const cardWidth = 300; // Larghezza card + gap
    this.container.nativeElement.scrollBy({
      left: direction * cardWidth,
      behavior: 'smooth'
    });
  }
}