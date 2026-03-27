import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { OrderService } from '../../core/services/order';
import { ProductService } from '../../core/services/product';
import { UserService } from '../../core/services/user';
import { ReviewService } from '../../core/services/review';
import { NotificationCounts, SalesReport } from '../../core/models';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.css']
})
export class Dashboard implements OnInit {
  private orderService = inject(OrderService);
  private productService = inject(ProductService);
  private userService = inject(UserService);
  private reviewService = inject(ReviewService);
  
  notifications: NotificationCounts = { newOrders: 0, outOfStock: 0 };
  salesReport: SalesReport | null = null;
  isLoading = true;
  
  ngOnInit(): void {
    this.loadData();
  }
  
  loadData(): void {
    this.isLoading = true;
    
    this.orderService.getNotifications().subscribe({
      next: (res) => {
        this.notifications = res.data;
      }
    });
    
    this.orderService.getSalesReport().subscribe({
      next: (res) => {
        this.salesReport = res.data;
        this.isLoading = false;
      },
      error: () => this.isLoading = false
    });
  }
  
  getRecentOrders(): void {
    this.orderService.getAdminOrders({ page: 1, limit: 5 }).subscribe();
  }
  
  getLowStockProducts(): void {
    this.productService.getAdminProducts({ page: 1, limit: 5 }).subscribe();
  }
}