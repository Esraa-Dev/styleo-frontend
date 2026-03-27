import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { PageService } from '../../core/services/page';
import { ContactUsContent } from '../../core/models';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './contact.html',
  styleUrls: ['./contact.css']
})
export class Contact implements OnInit {
  private fb = inject(FormBuilder);
  private pageService = inject(PageService);
  
  content: ContactUsContent | null = null;
  isLoading = true;
  isSubmitting = false;
  successMessage = '';
  errorMessage = '';
  
  form = this.fb.group({
    name: ['', [Validators.required]],
    email: ['', [Validators.required, Validators.email]],
    subject: ['', [Validators.required]],
    message: ['', [Validators.required, Validators.minLength(10)]]
  });
  
  ngOnInit(): void {
    this.pageService.getPage('contact_us').subscribe({
      next: (res) => {
        this.content = res.data.content as ContactUsContent;
        this.isLoading = false;
      },
      error: () => this.isLoading = false
    });
  }
  
  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    
    this.isSubmitting = true;
    this.successMessage = '';
    this.errorMessage = '';
    
    setTimeout(() => {
      this.successMessage = 'Thank you for your message. We will get back to you soon.';
      this.form.reset();
      this.isSubmitting = false;
    }, 1000);
  }
}