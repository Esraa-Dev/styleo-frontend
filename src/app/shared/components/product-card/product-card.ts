import { Component, Input, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CurrencyPipe } from '../../pipes/currency-pipe';
import { Product } from '../../../core/models';
import { CartService } from '../../../core/services/cart';
import { ProductService } from '../../../core/services/product';

@Component({
  selector: 'app-product-card',
  standalone: true,
  imports: [CommonModule, RouterModule, CurrencyPipe],
  templateUrl: './product-card.html',
  styleUrls: ['./product-card.css']
})
export class ProductCard {
  @Input() product!: Product;
  
  private cart = inject(CartService);
  private productService = inject(ProductService);
  
  getImageUrl(): string {
    return this.productService.getImageUrl(this.product.image);
  }
  
  addToCart(): void {
    this.cart.addItem(this.product._id, 1).subscribe();
  }
}