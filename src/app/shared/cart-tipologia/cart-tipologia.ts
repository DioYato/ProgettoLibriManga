import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common'; 

@Component({
  selector: 'app-cart-tipologia',
  imports: [CommonModule], 
  templateUrl: './cart-tipologia.html',
  styleUrl: './cart-tipologia.css',
})
export class CartTipologia {

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

  navigaLibri() {
  this.router.navigate(['/products'], { 
    queryParams: { categoriaId: 9 } 
  });
}

navigaManga() {
  this.router.navigate(['/products'], { 
    queryParams: { categoriaId: 10 } 
  });
}

}
