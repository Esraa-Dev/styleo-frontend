import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ProductCard } from '../../shared/components/product-card/product-card';
import { ProductService } from '../../core/services/product';
import { Product } from '../../core/models';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule, ProductCard],
  templateUrl: './home.html',
  styleUrls: ['./home.css']
})
export class Home implements OnInit {
  private productService = inject(ProductService);
  featuredProducts: Product[] = [];
  isLoading = true;

  ngOnInit(): void {
    this.productService.getProducts({ page: 1, limit: 8, sort: 'newest' }).subscribe({
      next: (res) => {
        this.featuredProducts = res.products;
        this.isLoading = false;
      },
      error: () => this.isLoading = false
    });
  }
}