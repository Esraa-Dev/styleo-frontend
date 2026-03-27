import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CartService } from '../../../core/services/cart';

@Component({
  selector: 'app-cart-icon',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './cart-icon.html',
  styleUrls: ['./cart-icon.css']
})
export class CartIcon {
  private cart = inject(CartService);
  itemCount$ = this.cart.itemCount$;
}