import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../core/services/auth';
import { CartService } from '../../core/services/cart';

const EGYPTIAN_PHONE_PATTERN = /^01[0125][0-9]{8}$/;
const PASSWORD_PATTERN = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/;
const MIN_PASSWORD_LENGTH = 8;
const MIN_NAME_LENGTH = 2;

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './register.html',
  styleUrls: ['./register.css']
})
export class Register {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private cartService = inject(CartService);
  private router = inject(Router);
  
  isLoading = false;
  errorMessage = '';
  showPassword = false;
  
  form = this.fb.group({
    fullName: ['', [Validators.required, Validators.minLength(MIN_NAME_LENGTH)]],
    email: ['', [Validators.required, Validators.email]],
    phone: ['', [Validators.required, Validators.pattern(EGYPTIAN_PHONE_PATTERN)]],
    password: ['', [Validators.required, Validators.minLength(MIN_PASSWORD_LENGTH), Validators.pattern(PASSWORD_PATTERN)]],
    gender: ['', [Validators.required]],
    address: ['']
  });
  
  async submit(): Promise<void> {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    
    this.isLoading = true;
    this.errorMessage = '';
    
    this.authService.register(this.form.value as any).subscribe({
      next: async () => {
        const guestItems = this.cartService.getGuestCart();
        if (guestItems.length) {
          this.cartService.mergeGuestCart(guestItems).subscribe();
        }
        this.router.navigate(['/']);
      },
      error: (err) => {
        this.errorMessage = err.error?.message || 'Registration failed. Please try again.';
        this.isLoading = false;
      }
    });
  }
}