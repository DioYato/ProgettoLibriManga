import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common'; // 1. Importa CommonModule

@Component({
  selector: 'app-cart-tipologia',
  imports: [CommonModule], // 2. Aggiungilo qui, per l'utilizzo di ngIf, ngFor e property binding delle immagini
  templateUrl: './cart-tipologia.html',
  styleUrl: './cart-tipologia.css',
})
export class CartTipologia {

  // Lista di copertine manga (URL reali o segnaposto coerenti)
  // Nota: usa immagini con proporzioni verticali (es. 200x300)
  mangaCovers = [
    'OnePiece.jpg', 
    'Naruto_vol1.jpg', 
    'Akira_vol1.jpg', 
    'https://giuntialpunto.it/cdn/shop/products/a2a28b724c7089e2bac9196363fc8e46.jpg?v=1716941678', 
    'kimetsu.jpg', 
    'Monster_vol1jpg.jpg', 
    'MHAcollection.jpg', 
    'https://m.media-amazon.com/images/I/71JonMDSX0L._SY425_.jpg', 
    'https://m.media-amazon.com/images/I/51Nv9Z9r8oL._SY445_SX342_ML2_.jpg', 
    'https://m.media-amazon.com/images/I/61cBSZXxXaS._SY425_.jpg', 
  ];

  constructor(private router: Router) {}

  navigaProdotti(categoria: string) {
    this.router.navigate(['/products'], { 
      queryParams: { genere: categoria } 
    });
  }

}
