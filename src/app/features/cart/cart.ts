import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CurrencyPipe } from '../../shared/pipes/currency-pipe';
import { CartService } from '../../core/services/cart';
import { ProductService } from '../../core/services/product';
import { Cart, CartItem } from '../../core/models';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, CurrencyPipe],
  templateUrl: './cart.html',
  styleUrls: ['./cart.css']
})
export class Cart implements OnInit {
  private cartService = inject(CartService);
  private productService = inject(ProductService);
  
  cart: Cart | null = null;
  isLoading = true;
  
  ngOnInit(): void {
    this.cartService.cart$.subscribe(cart => {
      this.cart = cart;
      this.isLoading = false;
    });
  }
  
  getImageUrl(filename: string): string {
    return this.productService.getImageUrl(filename);
  }
  
  updateQuantity(item: CartItem, newQuantity: number): void {
    if (newQuantity < 1) return;
    if (newQuantity > item.product.stockCount) return;
    this.cartService.updateItem(item.product._id, newQuantity).subscribe();
  }
  
  removeItem(productId: string): void {
    this.cartService.removeItem(productId).subscribe();
  }
  
  confirmPrice(productId: string | 'all'): void {
    this.cartService.confirmPrice(productId).subscribe();
  }
}