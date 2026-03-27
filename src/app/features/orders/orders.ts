import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CurrencyPipe } from '../../shared/pipes/currency-pipe';
import { OrderService } from '../../core/services/order';
import { Order } from '../../core/models';

@Component({
  selector: 'app-orders',
  standalone: true,
  imports: [CommonModule, RouterModule, CurrencyPipe],
  templateUrl: './orders.html',
  styleUrls: ['./orders.css']
})
export class Orders implements OnInit {
  private orderService = inject(OrderService);
  
  orders: Order[] = [];
  isLoading = true;
  currentPage = 1;
  totalPages = 1;
  
  ngOnInit(): void {
    this.loadOrders();
  }
  
  loadOrders(): void {
    this.isLoading = true;
    this.orderService.getMyOrders(this.currentPage).subscribe({
      next: (res) => {
        this.orders = res.data;
        this.totalPages = res.meta.pages;
        this.isLoading = false;
      },
      error: () => this.isLoading = false
    });
  }
  
  getStatusClass(status: string): string {
    const classes: Record<string, string> = {
      'Pending': 'bg-yellow-100 text-yellow-800',
      'Prepared': 'bg-blue-100 text-blue-800',
      'Shipped': 'bg-purple-100 text-purple-800',
      'Delivered': 'bg-green-100 text-green-800',
      'CancelledByUser': 'bg-red-100 text-red-800',
      'CancelledByAdmin': 'bg-red-100 text-red-800',
      'Rejected': 'bg-red-100 text-red-800'
    };
    return classes[status] || 'bg-gray-100 text-gray-800';
  }
  
  onPageChange(page: number): void {
    this.currentPage = page;
    this.loadOrders();
  }
}