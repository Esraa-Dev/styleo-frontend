import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { UserService } from '../../core/services/user';
import { AuthService } from '../../core/services/auth';
import { User } from '../../core/models';

const EGYPTIAN_PHONE_PATTERN = /^01[0125][0-9]{8}$/;

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './profile.html',
  styleUrls: ['./profile.css']
})
export class Profile implements OnInit {
  private fb = inject(FormBuilder);
  private userService = inject(UserService);
  private authService = inject(AuthService);
  
  user: User | null = null;
  isLoading = true;
  isSaving = false;
  isChangingPassword = false;
  successMessage = '';
  errorMessage = '';
  
  profileForm = this.fb.group({
    fullName: ['', [Validators.required, Validators.minLength(2)]],
    email: ['', [Validators.required, Validators.email]],
    phone: ['', [Validators.required, Validators.pattern(EGYPTIAN_PHONE_PATTERN)]],
    address: ['']
  });
  
  passwordForm = this.fb.group({
    currentPassword: ['', [Validators.required, Validators.minLength(8)]],
    newPassword: ['', [Validators.required, Validators.minLength(8), Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)]],
    confirmPassword: ['', [Validators.required]]
  });
  
  ngOnInit(): void {
    this.user = this.authService.getCurrentUser();
    if (this.user) {
      this.profileForm.patchValue({
        fullName: this.user.fullName,
        email: this.user.email,
        phone: this.user.phone,
        address: this.user.address || ''
      });
    }
    this.isLoading = false;
  }
  
  updateProfile(): void {
    if (this.profileForm.invalid) {
      this.profileForm.markAllAsTouched();
      return;
    }
    
    this.isSaving = true;
    this.errorMessage = '';
    this.successMessage = '';
    
    this.userService.updateProfile(this.profileForm.value as any).subscribe({
      next: (res) => {
        this.authService.updateUser(res.data);
        this.user = res.data;
        this.successMessage = 'Profile updated successfully';
        this.isSaving = false;
        setTimeout(() => this.successMessage = '', 3000);
      },
      error: (err) => {
        this.errorMessage = err.error?.message || 'Failed to update profile';
        this.isSaving = false;
      }
    });
  }
  
  changePassword(): void {
    if (this.passwordForm.invalid) {
      this.passwordForm.markAllAsTouched();
      return;
    }
    
    if (this.passwordForm.value.newPassword !== this.passwordForm.value.confirmPassword) {
      this.errorMessage = 'Passwords do not match';
      return;
    }
    
    this.isChangingPassword = true;
    this.errorMessage = '';
    this.successMessage = '';
    
    this.userService.changePassword(
      this.passwordForm.value.currentPassword!,
      this.passwordForm.value.newPassword!
    ).subscribe({
      next: () => {
        this.successMessage = 'Password changed successfully';
        this.passwordForm.reset();
        this.isChangingPassword = false;
        setTimeout(() => this.successMessage = '', 3000);
      },
      error: (err) => {
        this.errorMessage = err.error?.message || 'Failed to change password';
        this.isChangingPassword = false;
      }
    });
  }
}