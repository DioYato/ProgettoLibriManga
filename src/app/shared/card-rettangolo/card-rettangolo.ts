import { Component } from '@angular/core';

@Component({
  selector: 'app-card-rettangolo',
  imports: [],
  templateUrl: './card-rettangolo.html',
  styleUrl: './card-rettangolo.css',
})
export class CardRettangolo {

  cards = [

    {
      img : "https://images.ctfassets.net/qpn1gztbusu2/4bXrr0BdcdCWOEfjghns8d/7a39576f2029c4cc33b152d1f88f68a0/Action_Thriller.webp?fm=avif&w=1920&q=70",
      genere : "azione"
    },
    {
      img: "https://www.cinemaeliseo.it/toolbox/our_img/locandine/big/0002957.jpg",
      genere : "avventura"
    },
    {
      img : "https://m.media-amazon.com/images/I/51eCAIQaALL._SY385_.jpg",
      genere : "giallo"
    },
    {
      img : "https://www.illibraio.it/wp-content/uploads/2021/06/libri-thriller-2021-Perez-Gellida.jpg",
      genere : "thriller"
    }
  ]
}
