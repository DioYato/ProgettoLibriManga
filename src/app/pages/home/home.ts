import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

void RouterLink;

@Component({
  selector: 'app-home',
  imports: [RouterLink],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home {
  featured = [
    { name: 'One Piece Vol. 1', price: 5.20, img: 'https://picsum.photos/600/400?manga1' },
    { name: 'Berserk Vol. 1', price: 6.90, img: 'https://picsum.photos/600/400?manga2' },
    { name: 'Tokyo Ghoul Vol. 1', price: 5.90, img: 'https://picsum.photos/600/400?manga3' },
    { name: 'Death Note Vol. 1', price: 5.90, img: 'https://picsum.photos/600/400?manga4' },
  ];
  
}



