import { Component, OnInit, signal } from '@angular/core';
import { FavoritesService } from '../services/favorites.service';
import { ProductsService } from '../services/products.service';
import { Product } from '../services/products.service';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-favorites-page',
  imports: [RouterModule],
  templateUrl: './favorites-page.html',
  styleUrls: ['./favorites-page.css']
})
export class FavoritesPageComponent implements OnInit {

  readonly items = signal<Product[]>([]);

  constructor(
    private favorites: FavoritesService,
    private products: ProductsService
  ) {}

  ngOnInit() {
    const localIds = this.favorites.ids();
    if (localIds.length > 0) {
      this.products.loadFromBackend().subscribe(() => {
        this.items.set(this.products.all().filter((p) => localIds.includes(p.id)));
      });
    }

    this.favorites.loadFromBackend().subscribe((backendIds) => {
      if (backendIds.length === 0) {
        if (localIds.length === 0) {
          this.items.set([]);
        }
        return;
      }

      const idsChanged = backendIds.length !== localIds.length || backendIds.some((id: any, index: any) => id !== localIds[index]);
      if (idsChanged) {
        this.products.loadFromBackend().subscribe(() => {
          this.items.set(this.products.all().filter((p) => backendIds.includes(p.id)));
        });
      }
    });
  }


  imageUrl(fileName: string) {
    return 'http://localhost:8080/images/' + fileName;
  }
}

