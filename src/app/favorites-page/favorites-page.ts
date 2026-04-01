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
    const localIds = this.favorites.ids();
    if (localIds.length > 0) {
      this.products.loadFromBackend().subscribe(() => {
        this.items = this.products.all().filter((p) => localIds.includes(p.id));
      });
    }

    this.favorites.loadFromBackend().subscribe((backendIds) => {
      if (backendIds.length === 0) {
        if (localIds.length === 0) {
          this.items = [];
        }
        return;
      }

      const idsChanged = backendIds.length !== localIds.length || backendIds.some((id: any, index: any) => id !== localIds[index]);
      if (idsChanged) {
        this.products.loadFromBackend().subscribe(() => {
          this.items = this.products.all().filter((p) => backendIds.includes(p.id));
        });
      }
    });
  }


  imageUrl(fileName: string) {
    return 'http://localhost:8080/api/images/' + fileName;
  }
}

