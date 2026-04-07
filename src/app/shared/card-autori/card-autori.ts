import { Component, signal, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-card-autori',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './card-autori.html',
  styleUrl: './card-autori.css',
})
export class CardAutori {
  @ViewChild('containerCarosello') container!: ElementRef;

 Autori = [

  {
    id:1,
    img: "https://images.mubicdn.net/images/cast_member/452378/cache-274485-1509594212/image-w856.jpg?size=300x",
    nome: "masashi Kishimoto"
  },

  {
    id:2,
    img: "https://media.mondadoristore.it/picture/978881715981/64/NZO",
    nome: "Dante Alighieri"
  },

  {
    id:3,
    img: "https://media.mondadoristore.it/picture/978881715981/64/NZO",
    nome: "Akira Toriyama"
  },
  {
    id:4,
    img: "https://media.mondadoristore.it/picture/978881715981/64/NZO",
    nome: "Eichiro Oda"
  },
  {
    id:5,
    img: "https://media.mondadoristore.it/picture/978881715981/64/NZO",
    nome: "uma musume"
  }
 ]
  

  scroll(direction: number) {
  // Scorre esattamente della larghezza della "finestra" visibile
  const vediQuante = this.container.nativeElement.clientWidth;
  this.container.nativeElement.scrollBy({
    left: direction * (vediQuante * 0.7), // Scorre del 70% della vista per non perdere il filo
    behavior: 'smooth'
  });
}

}