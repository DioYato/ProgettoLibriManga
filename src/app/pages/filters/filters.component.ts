import { Component, EventEmitter, Output } from '@angular/core';

export interface ProductFilters {
  genres: number[];
}

@Component({
  selector: 'app-products-filters',
  templateUrl: './filters.component.html',
  styleUrl: './filters.component.css',
})
export class FiltersComponent {

  tipologie = [
    { id: 9, categoria: 'Libri' },
    { id: 10, categoria: 'Manga' },
  ]

  generi = [
    { id: 1, categoria: 'Classici' },
    { id: 2, categoria: 'Fantasy' },
    { id: 3, categoria: 'Romanzo Storico' },
    { id: 4, categoria: 'Narrativa' },
    { id: 5, categoria: 'Saggistica' },
    { id: 6, categoria: 'Giallo' },
    { id: 7, categoria: 'Horror' },
    { id: 8, categoria: 'Fantascienza' },
  ];

  selectedGenres: number[] = [];

  @Output() filtersChange = new EventEmitter<ProductFilters>();

  toggleGenre(id: number, event: Event) {
    const checked = (event.target as HTMLInputElement).checked;
    this.selectedGenres = checked
      ? [...this.selectedGenres, id]
      : this.selectedGenres.filter(g => g !== id);
  }

  apply() {
    this.filtersChange.emit({
      genres: this.selectedGenres,
    });
  }
}
