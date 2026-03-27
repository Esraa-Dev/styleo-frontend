import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ReviewService } from '../../core/services/review';
import { AuthService } from '../../core/services/auth';
import { Review } from '../../core/models';

@Component({
  selector: 'app-testimonials',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './testimonials.html',
  styleUrls: ['./testimonials.css']
})
export class Testimonials implements OnInit {
  private fb = inject(FormBuilder);
  private reviewService = inject(ReviewService);
  private authService = inject(AuthService);
  
  reviews: Review[] = [];
  isLoading = true;
  isSubmitting = false;
  successMessage = '';
  errorMessage = '';
  showForm = false;
  
  form = this.fb.group({
    rating: [5, [Validators.required, Validators.min(1), Validators.max(5)]],
    reviewText: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(500)]]
  });
  
  ngOnInit(): void {
    this.loadReviews();
  }
  
  loadReviews(): void {
    this.isLoading = true;
    this.reviewService.getApprovedReviews().subscribe({
      next: (res) => {
        this.reviews = res.data;
        this.isLoading = false;
      },
      error: () => this.isLoading = false
    });
  }
  
  submitReview(): void {
    if (!this.authService.isLoggedIn()) {
      this.errorMessage = 'Please login to submit a review';
      setTimeout(() => this.errorMessage = '', 3000);
      return;
    }
    
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    
    this.isSubmitting = true;
    this.errorMessage = '';
    this.successMessage = '';
    
    this.reviewService.createReview(this.form.value as any).subscribe({
      next: () => {
        this.successMessage = 'Thank you! Your review has been submitted for approval.';
        this.form.reset({ rating: 5 });
        this.showForm = false;
        this.isSubmitting = false;
        setTimeout(() => this.successMessage = '', 5000);
      },
      error: (err) => {
        this.errorMessage = err.error?.message || 'Failed to submit review';
        this.isSubmitting = false;
      }
    });
  }
  
  getStarArray(rating: number): number[] {
    return Array(Math.floor(rating)).fill(0);
  }
  
  getRatingText(rating: number): string {
    const texts: Record<number, string> = {
      5: 'Excellent',
      4: 'Very Good',
      3: 'Good',
      2: 'Fair',
      1: 'Poor'
    };
    return texts[rating] || '';
  }
}