import { Component, inject, OnInit, signal } from '@angular/core';
import { FavoritesService } from '../services/favorites.service';
import { Libro } from '../models/libro.model';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-favorites-page',
  imports: [RouterModule],
  templateUrl: './favorites-page.html',
  styleUrls: ['./favorites-page.css']
})
export class FavoritesPageComponent implements OnInit {

  protected readonly items = signal<Libro[]>([]);

  private readonly _favorites = inject(FavoritesService);
  
  ngOnInit() {
    this._favorites.loadFromBackend().subscribe((books) => {
      this.items.set(books);
    });
  }

  imageUrl(fileName: string) {
    return 'http://localhost:8080/images/' + fileName;
  }
}

