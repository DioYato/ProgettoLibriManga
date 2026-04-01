import { Component, OnInit } from '@angular/core';
import { FavoritesService } from '../data/favorites.service';
import { ProductsService } from '../data/products.service';
import { Product } from '../data/products.service';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-favorites-page',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './favorites-page.html',
  styleUrls: ['./favorites-page.css']
})
export class FavoritesPageComponent implements OnInit {

  items: Product[] = [];

  constructor(
    private favorites: FavoritesService,
    private products: ProductsService
  ) {}

  ngOnInit() {
  const ids = this.favorites.ids();
  const all = this.products.all();
  this.items = all.filter(p => ids.includes(p.id));
}


  imageUrl(fileName: string) {
    return 'http://localhost:8080/api/images/' + fileName;
  }
}

