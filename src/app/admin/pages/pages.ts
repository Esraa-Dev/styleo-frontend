import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PageService } from '../../core/services/page';
import { AboutUsContent, FaqItem, ContactUsContent } from '../../core/models';

@Component({
  selector: 'app-admin-pages',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './pages.html',
  styleUrls: ['./pages.css']
})
export class AdminPages implements OnInit {
  private pageService = inject(PageService);
  
  activeTab = 'about';
  isLoading = false;
  isSaving = false;
  successMessage = '';
  errorMessage = '';
  
  aboutContent: AboutUsContent = { title: '', intro: '', highlights: [], story: '' };
  faqItems: FaqItem[] = [];
  contactContent: ContactUsContent = { phone: '', email: '', address: '', hours: '', social: [] };
  
  ngOnInit(): void {
    this.loadPages();
  }
  
  loadPages(): void {
    this.isLoading = true;
    
    this.pageService.getPage('about_us').subscribe({
      next: (res) => {
        this.aboutContent = res.data.content as AboutUsContent;
        this.isLoading = false;
      },
      error: () => this.isLoading = false
    });
    
    this.pageService.getPage('faq').subscribe({
      next: (res) => {
        this.faqItems = res.data.content as FaqItem[];
      }
    });
    
    this.pageService.getPage('contact_us').subscribe({
      next: (res) => {
        this.contactContent = res.data.content as ContactUsContent;
      }
    });
  }
  
  saveAbout(): void {
    this.isSaving = true;
    this.pageService.updateAboutUs(this.aboutContent.title, this.aboutContent.intro).subscribe({
      next: () => {
        this.successMessage = 'About Us page updated successfully';
        this.isSaving = false;
        setTimeout(() => this.successMessage = '', 3000);
      },
      error: () => {
        this.errorMessage = 'Failed to update About Us page';
        this.isSaving = false;
      }
    });
  }
  
  addFaqItem(): void {
    this.faqItems.push({ question: '', answer: '' });
  }
  
  removeFaqItem(index: number): void {
    this.faqItems.splice(index, 1);
  }
  
  saveFaq(): void {
    this.isSaving = true;
    this.pageService.updateFaq(this.faqItems).subscribe({
      next: () => {
        this.successMessage = 'FAQ page updated successfully';
        this.isSaving = false;
        setTimeout(() => this.successMessage = '', 3000);
      },
      error: () => {
        this.errorMessage = 'Failed to update FAQ page';
        this.isSaving = false;
      }
    });
  }
  
  addSocialLink(): void {
    this.contactContent.social.push({ label: '', url: '' });
  }
  
  removeSocialLink(index: number): void {
    this.contactContent.social.splice(index, 1);
  }
  
  saveContact(): void {
    this.isSaving = true;
    this.pageService.updateContactUs(this.contactContent).subscribe({
      next: () => {
        this.successMessage = 'Contact Us page updated successfully';
        this.isSaving = false;
        setTimeout(() => this.successMessage = '', 3000);
      },
      error: () => {
        this.errorMessage = 'Failed to update Contact Us page';
        this.isSaving = false;
      }
    });
  }
  
  trackByIndex(index: number): number {
    return index;
  }
}