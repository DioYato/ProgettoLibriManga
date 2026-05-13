import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output, inject, OnChanges, SimpleChanges, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { ReviewsService } from '../../services/reviews.service';
import { StarRatingComponent } from '../star-rating/star-rating';
import { Review, ReviewRequest } from '../../models/review.model';

@Component({
  selector: 'app-reviews',
  imports: [CommonModule, FormsModule, StarRatingComponent],
  templateUrl: './reviews.html',
  styleUrl: './reviews.css',
})
export class ReviewsComponent implements OnChanges {

  @Input() productId?: number;
  @Input() selectedRating = 5;
  @Output() selectedRatingChange = new EventEmitter<number>();

  private readonly reviewsService = inject(ReviewsService);
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);

  readonly user = this.auth.user;
  readonly reviews = signal<Review[]>([]);
  readonly loading = signal(false);
  readonly submitting = signal(false);
  readonly submitError = signal<string | null>(null);

  rating = 5;
  comment = '';

  ngOnChanges(changes: SimpleChanges) {
    if (changes['productId'] && this.productId) {
      this.loadReviews();
    }

    if (changes['selectedRating']) {
      this.rating = this.selectedRating ?? 5;
    }
  }

  get isLogged() {
    return !!this.user();
  }

  loadReviews() {
    if (!this.productId) {
      this.reviews.set([]);
      return;
    }

    this.loading.set(true);
    this.reviewsService.getByProduct(this.productId).subscribe({
      next: (result) => {
        this.reviews.set(result || []);
        this.loading.set(false);
      },
      error: () => {
        this.reviews.set([]);
        this.loading.set(false);
      }
    });
  }

  setRating(value: number) {
    this.rating = value;
    this.selectedRatingChange.emit(value);
  }

  submitReview() {
    const currentUser = this.user();
    if (!currentUser) {
      alert('Devi effettuare il login per lasciare una recensione.');
      this.router.navigate(['/login']);
      return;
    }

    if (!this.productId || !this.comment.trim()) {
      return;
    }

    const review: ReviewRequest = {
      idLibro: this.productId,
      idUtente: currentUser.id,
      stelle: this.rating,
      contenuto: this.comment.trim(),
    };

    this.submitting.set(true);
    this.submitError.set(null);
    this.reviewsService.submitReview(review).subscribe({
      next: () => {
        this.comment = '';
        this.rating = 5;
        this.selectedRatingChange.emit(this.rating);
        this.submitting.set(false);
        this.loadReviews();
        alert('Recensione inviata con successo!');
      },
      error: (err) => {
        this.submitting.set(false);
        this.submitError.set('Errore nell\'invio della recensione. Riprova.');
        console.error('Errore:', err);
      }
    });
  }

  get reviewCount() {
    return this.reviews().length;
  }

  formatStars(value: number) {
    return '★'.repeat(value) + '☆'.repeat(5 - value);
  }

  formatDate(date: string | Date) {
    const d = typeof date === 'string' ? new Date(date) : date;
    return d.toLocaleDateString('it-IT', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    });
  }
}

