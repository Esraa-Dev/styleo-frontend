import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CartIcon } from '../cart-icon/cart-icon';
import { AuthService } from '../../../core/services/auth';
import { CartService } from '../../../core/services/cart';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule, CartIcon],
  templateUrl: './header.html',
  styleUrls: ['./header.css']
})
export class Header {
  private auth = inject(AuthService);
  private cart = inject(CartService);
  
  isMenuOpen = false;
  
  user$ = this.auth.user$;
  itemCount$ = this.cart.itemCount$;
  
  logout(): void {
    this.auth.logout();
    this.isMenuOpen = false;
  }
  
  toggleMenu(): void {
    this.isMenuOpen = !this.isMenuOpen;
  }
}