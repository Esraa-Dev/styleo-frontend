import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PageService } from '../../core/services/page';
import { AboutUsContent } from '../../core/models';

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './about.html',
  styleUrls: ['./about.css']
})
export class About implements OnInit {
  private pageService = inject(PageService);
  
  content: AboutUsContent | null = null;
  isLoading = true;
  
  ngOnInit(): void {
    this.pageService.getPage('about_us').subscribe({
      next: (res) => {
        this.content = res.data.content as AboutUsContent;
        this.isLoading = false;
      },
      error: () => this.isLoading = false
    });
  }
}