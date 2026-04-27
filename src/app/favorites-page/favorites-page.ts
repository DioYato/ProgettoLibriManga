import { Component, inject, OnInit, signal } from '@angular/core';
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

  protected readonly items = signal<Product[]>([]);

  private readonly _favorites = inject(FavoritesService);

  private readonly _products = inject(ProductsService);  
  
  ngOnInit() {
    const localIds = this._favorites.ids();
    if (localIds.length > 0) {
      this._products.loadFromBackend().subscribe(() => {
        // Filtro va applicato sulla query nel backend
        this.items.set(this._products.all().filter((p) => localIds.includes(p.id)));
      });
    }

    this._favorites.loadFromBackend().subscribe((backendIds) => {
      if (backendIds.length === 0) {
        if (localIds.length === 0) {
          this.items.set([]);
        }
        return;
      }

      const idsChanged = backendIds.length !== localIds.length || backendIds.some((id: any, index: any) => id !== localIds[index]);
      if (idsChanged) {
        this._products.loadFromBackend().subscribe(() => {
          this.items.set(this._products.all().filter((p) => backendIds.includes(p.id)));
        });
      }
    });
  }

  imageUrl(fileName: string) {
    return 'http://localhost:8080/images/' + fileName;
  }
}

