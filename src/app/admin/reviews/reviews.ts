import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ReviewService } from '../../core/services/review';
import { Review } from '../../core/models';
import { PAGINATION } from '../../core/constants/app.constants';

@Component({
  selector: 'app-admin-reviews',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './reviews.html',
  styleUrls: ['./reviews.css']
})
export class AdminReviews implements OnInit {
  private reviewService = inject(ReviewService);
  
  reviews: Review[] = [];
  isLoading = true;
  isUpdating = false;
  
  currentPage = PAGINATION.DEFAULT_PAGE;
  totalPages = 1;
  totalItems = 0;
  limit = PAGINATION.ADMIN_LIMIT;
  
  statusFilter = '';
  statusOptions = ['pending', 'approved', 'rejected', 'ignored'];
  
  ngOnInit(): void {
    this.loadReviews();
  }
  
  loadReviews(): void {
    this.isLoading = true;
    this.reviewService.getAdminReviews(this.statusFilter || undefined, this.currentPage, this.limit).subscribe({
      next: (res) => {
        this.reviews = res.data;
        this.totalPages = res.meta.pages;
        this.totalItems = res.meta.total;
        this.isLoading = false;
      },
      error: () => this.isLoading = false
    });
  }
  
  filterByStatus(): void {
    this.currentPage = 1;
    this.loadReviews();
  }
  
  resetFilter(): void {
    this.statusFilter = '';
    this.currentPage = 1;
    this.loadReviews();
  }
  
  onPageChange(page: number): void {
    this.currentPage = page;
    this.loadReviews();
  }
  
  updateStatus(review: Review, newStatus: string): void {
    this.isUpdating = true;
    this.reviewService.updateReviewStatus(review._id, newStatus).subscribe({
      next: (res) => {
        const index = this.reviews.findIndex(r => r._id === review._id);
        if (index !== -1) this.reviews[index] = res.data;
        this.isUpdating = false;
      },
      error: () => this.isUpdating = false
    });
  }
  
  getStarArray(rating: number): number[] {
    return Array(Math.floor(rating)).fill(0);
  }
}