import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { CurrencyPipe } from '../../shared/pipes/currency-pipe';
import { OrderService } from '../../core/services/order';
import { ProductService } from '../../core/services/product';
import { Order } from '../../core/models';

@Component({
  selector: 'app-order-detail',
  standalone: true,
  imports: [CommonModule, CurrencyPipe],
  templateUrl: './order-detail.html',
  styleUrls: ['./order-detail.css']
})
export class OrderDetail implements OnInit {
  private route = inject(ActivatedRoute);
  private orderService = inject(OrderService);
  private productService = inject(ProductService);
  private router = inject(Router);
  
  order: Order | null = null;
  isLoading = true;
  cancelling = false;
  
  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.loadOrder(params['id']);
    });
  }
  
  loadOrder(id: string): void {
    this.isLoading = true;
    this.orderService.getMyOrderById(id).subscribe({
      next: (res) => {
        this.order = res.data;
        this.isLoading = false;
      },
      error: () => this.isLoading = false
    });
  }
  
  cancelOrder(): void {
    if (!confirm('Are you sure you want to cancel this order?')) return;
    
    this.cancelling = true;
    this.orderService.cancelMyOrder(this.order!._id).subscribe({
      next: (res) => {
        this.order = res.data;
        this.cancelling = false;
      },
      error: () => this.cancelling = false
    });
  }
  
  getImageUrl(filename: string): string {
    return this.productService.getImageUrl(filename);
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
  
  canCancel(): boolean {
    return this.order?.status === 'Pending';
  }
}