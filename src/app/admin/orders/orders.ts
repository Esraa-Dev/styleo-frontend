import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { CurrencyPipe } from '../../shared/pipes/currency-pipe';
import { OrderService } from '../../core/services/order';
import { Order, OrderStatus } from '../../core/models';
import { PAGINATION } from '../../core/constants/app.constants';

@Component({
  selector: 'app-admin-orders',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, CurrencyPipe],
  templateUrl: './orders.html',
  styleUrls: ['./orders.css']
})
export class AdminOrders implements OnInit {
  private orderService = inject(OrderService);
  
  orders: Order[] = [];
  isLoading = true;
  isUpdating = false;
  
  currentPage = PAGINATION.DEFAULT_PAGE;
  totalPages = 1;
  totalItems = 0;
  limit = PAGINATION.ADMIN_LIMIT;
  
  filters = {
    status: '',
    search: '',
    dateFrom: '',
    dateTo: ''
  };
  
  statusOptions: OrderStatus[] = ['Pending', 'Prepared', 'Shipped', 'Delivered', 'CancelledByUser', 'CancelledByAdmin', 'Rejected'];
  
  ngOnInit(): void {
    this.loadOrders();
  }
  
  loadOrders(): void {
    this.isLoading = true;
    this.orderService.getAdminOrders({
      page: this.currentPage,
      limit: this.limit,
      status: this.filters.status || undefined,
      search: this.filters.search || undefined,
      dateFrom: this.filters.dateFrom || undefined,
      dateTo: this.filters.dateTo || undefined
    }).subscribe({
      next: (res) => {
        this.orders = res.data;
        this.totalPages = res.meta.pages;
        this.totalItems = res.meta.total;
        this.isLoading = false;
      },
      error: () => this.isLoading = false
    });
  }
  
  applyFilters(): void {
    this.currentPage = 1;
    this.loadOrders();
  }
  
  resetFilters(): void {
    this.filters = { status: '', search: '', dateFrom: '', dateTo: '' };
    this.currentPage = 1;
    this.loadOrders();
  }
  
  onPageChange(page: number): void {
    this.currentPage = page;
    this.loadOrders();
  }
  
  updateStatus(order: Order, newStatus: OrderStatus): void {
    this.isUpdating = true;
    this.orderService.updateOrderStatus(order._id, { status: newStatus }).subscribe({
      next: (res) => {
        const index = this.orders.findIndex(o => o._id === order._id);
        if (index !== -1) this.orders[index] = res.data;
        this.isUpdating = false;
      },
      error: () => this.isUpdating = false
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
  
  canUpdateStatus(status: OrderStatus): OrderStatus[] {
    const transitions: Record<OrderStatus, OrderStatus[]> = {
      'Pending': ['Prepared', 'CancelledByAdmin', 'Rejected'],
      'Prepared': ['Shipped', 'CancelledByAdmin', 'Rejected'],
      'Shipped': ['Delivered', 'CancelledByAdmin', 'Rejected'],
      'Delivered': [],
      'CancelledByUser': [],
      'CancelledByAdmin': [],
      'Rejected': []
    };
    return transitions[status] || [];
  }
}