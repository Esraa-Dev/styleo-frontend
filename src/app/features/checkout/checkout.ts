import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CurrencyPipe } from '../../shared/pipes/currency-pipe';
import { CartService } from '../../core/services/cart';
import { OrderService } from '../../core/services/order';
import { AuthService } from '../../core/services/auth';
import { Cart } from '../../core/models';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, CurrencyPipe],
  templateUrl: './checkout.html',
  styleUrls: ['./checkout.css']
})
export class Checkout implements OnInit {
  private fb = inject(FormBuilder);
  private cartService = inject(CartService);
  private orderService = inject(OrderService);
  private authService = inject(AuthService);
  private router = inject(Router);
  
  cart: Cart | null = null;
  isLoading = false;
  isSubmitting = false;
  
  form = this.fb.group({
    deliveryPhone: ['', [Validators.required, Validators.pattern(/^01[0125][0-9]{8}$/)]],
    deliveryAddress: ['', [Validators.required, Validators.minLength(5)]]
  });
  
  ngOnInit(): void {
    this.cartService.cart$.subscribe(cart => {
      this.cart = cart;
      if (cart && cart.items.length === 0) {
        this.router.navigate(['/cart']);
      }
    });
    
    const user = this.authService.getCurrentUser();
    if (user) {
      if (user.phone) this.form.patchValue({ deliveryPhone: user.phone });
      if (user.address) this.form.patchValue({ deliveryAddress: user.address });
    }
  }
  
  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    
    this.isSubmitting = true;
    this.orderService.createOrder(this.form.value as any).subscribe({
      next: (res) => {
        this.router.navigate(['/orders', res.data._id]);
      },
      error: () => this.isSubmitting = false
    });
  }
}