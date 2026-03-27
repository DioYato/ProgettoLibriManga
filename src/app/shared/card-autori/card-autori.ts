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
    img: "https://media.mondadoristore.it/picture/978881715981/64/NZO",
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
  // Calcola la larghezza esatta visibile in quel momento
  const width = this.container.nativeElement.offsetWidth;

  this.container.nativeElement.scrollBy({
    left: direction * width, // Scorre esattamente di una "pagina"
    behavior: 'smooth'
  });
}


}