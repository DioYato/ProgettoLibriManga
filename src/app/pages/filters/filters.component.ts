import { Component, EventEmitter, Output } from '@angular/core';

export interface ProductFilters {
  types: string[];
  genres: number[];
}

@Component({
  selector: 'app-products-filters',
  standalone: true,
  templateUrl: './filters.component.html',
  styleUrl: './filters.component.css',
})
export class FiltersComponent {

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

  selectedTypes: string[] = [];
  selectedGenres: number[] = [];

  @Output() filtersChange = new EventEmitter<ProductFilters>();

  toggleType(type: string, event: Event) {
    const checked = (event.target as HTMLInputElement).checked;
    this.selectedTypes = checked
      ? [...this.selectedTypes, type]
      : this.selectedTypes.filter(t => t !== type);
  }

  toggleGenre(id: number, event: Event) {
    const checked = (event.target as HTMLInputElement).checked;
    this.selectedGenres = checked
      ? [...this.selectedGenres, id]
      : this.selectedGenres.filter(g => g !== id);
  }

  apply() {
    this.filtersChange.emit({
      types: this.selectedTypes,
      genres: this.selectedGenres,
    });
  }
}
