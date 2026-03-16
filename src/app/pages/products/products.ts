import { Component, computed, signal } from '@angular/core';

@Component({
  selector: 'app-products',
  imports: [],
  templateUrl: './products.html',
  styleUrl: './products.css',
})
export class Products {
  private readonly allProducts = signal([
    { name: 'Il Signore degli Anelli', price: 24.90, img: 'https://picsum.photos/300/400?book1' },
    { name: '1984', price: 14.50, img: 'https://picsum.photos/300/400?book2' },
    { name: 'Il Nome della Rosa', price: 18.00, img: 'https://picsum.photos/300/400?book3' },
    { name: 'Dune', price: 22.99, img: 'https://picsum.photos/300/400?book4' },
    { name: 'Harry Potter e la Pietra Filosofale', price: 12.99, img: 'https://picsum.photos/300/400?book5' },
    { name: 'Sapiens', price: 19.90, img: 'https://picsum.photos/300/400?book6' },
    { name: 'Il Codice Da Vinci', price: 16.50, img: 'https://picsum.photos/300/400?book7' },
    { name: 'La Strada', price: 13.40, img: 'https://picsum.photos/300/400?book8' },
    { name: 'One Piece Vol. 1', price: 5.20, img: 'https://picsum.photos/300/400?manga1' },
    { name: 'Berserk Vol. 1', price: 6.90, img: 'https://picsum.photos/300/400?manga2' },
    { name: 'Tokyo Ghoul Vol. 1', price: 5.90, img: 'https://picsum.photos/300/400?manga3' },
    { name: 'Death Note Vol. 1', price: 5.90, img: 'https://picsum.photos/300/400?manga4' }
  ]);

  readonly query = signal('');

  readonly products = computed(() => {
    const q = this.query().trim().toLowerCase();
    const items = this.allProducts();
    if (!q) return items;
    return items.filter((p) => p.name.toLowerCase().includes(q));
  });

  onSearch(value: string) {
    this.query.set(value);
  }

}
