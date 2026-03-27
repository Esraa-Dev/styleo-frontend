import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CurrencyPipe } from '../../shared/pipes/currency-pipe';
import { ProductService } from '../../core/services/product';
import { CartService } from '../../core/services/cart';
import { ReviewService } from '../../core/services/review';
import { Product, Review } from '../../core/models';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, CurrencyPipe],
  templateUrl: './product-detail.html',
  styleUrls: ['./product-detail.css']
})
export class ProductDetail implements OnInit {
  private route = inject(ActivatedRoute);
  private productService = inject(ProductService);
  private cartService = inject(CartService);
  private reviewService = inject(ReviewService);
  
  product: Product | null = null;
  reviews: Review[] = [];
  isLoading = true;
  quantity = 1;
  selectedImage = '';
  
  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.loadProduct(params['slug']);
    });
  }
  
  loadProduct(slug: string): void {
    this.isLoading = true;
    this.productService.getProductBySlug(slug).subscribe({
      next: (res) => {
        this.product = res.data;
        this.selectedImage = this.productService.getImageUrl(this.product!.image);
        this.loadReviews();
        this.isLoading = false;
      },
      error: () => this.isLoading = false
    });
  }
  
  loadReviews(): void {
    this.reviewService.getApprovedReviews().subscribe({
      next: (res) => {
        this.reviews = res.data.filter(r => r.status === 'approved');
      },
      error: () => {}
    });
  }
  
  addToCart(): void {
    if (this.product && this.quantity <= this.product.stockCount) {
      this.cartService.addItem(this.product._id, this.quantity).subscribe();
    }
  }
  
  getAverageRating(): number {
    if (this.reviews.length === 0) return 0;
    const sum = this.reviews.reduce((acc, r) => acc + r.rating, 0);
    return sum / this.reviews.length;
  }
  
  getStarArray(rating: number): number[] {
    return Array(Math.floor(rating)).fill(0);
  }
}