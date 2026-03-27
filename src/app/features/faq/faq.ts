import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PageService } from '../../core/services/page';
import { FaqItem } from '../../core/models';

@Component({
  selector: 'app-faq',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './faq.html',
  styleUrls: ['./faq.css']
})
export class Faq implements OnInit {
  private pageService = inject(PageService);
  
  faqs: FaqItem[] = [];
  isLoading = true;
  openIndex: number | null = null;
  
  ngOnInit(): void {
    this.pageService.getPage('faq').subscribe({
      next: (res) => {
        this.faqs = res.data.content as FaqItem[];
        this.isLoading = false;
      },
      error: () => this.isLoading = false
    });
  }
  
  toggle(index: number): void {
    this.openIndex = this.openIndex === index ? null : index;
  }
}