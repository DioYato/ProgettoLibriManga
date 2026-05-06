import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-star-rating',
  imports: [CommonModule],
  templateUrl: './star-rating.html',
  styleUrl: './star-rating.css',
})
export class StarRatingComponent {
  // Component UI per la selezione delle stelle.
  // Le chiamate al backend per salvare e leggere le recensioni sono gestite in ReviewsService.
  @Input() value = 0;
  @Input() max = 5;
  @Input() readonly = false;
  @Input() size = '1.3rem';
  @Input() activeColor = '#f59e0b';
  @Input() inactiveColor = '#d1d5db';
  @Output() valueChange = new EventEmitter<number>();

  get stars() {
    return Array.from({ length: this.max }, (_, i) => i + 1);
  }

  select(value: number) {
    if (this.readonly) return;
    this.valueChange.emit(value);
  }
}
