import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Order, CreateOrderPayload, ApiResponse, PaginatedResponse, AdminOrderQuery, UpdateOrderStatusPayload, SalesReport, NotificationCounts } from '../models';

@Injectable({ providedIn: 'root' })
export class OrderService {
  private http = inject(HttpClient);
  private api = `${environment.apiUrl}/orders`;

  createOrder(payload: CreateOrderPayload): Observable<ApiResponse<Order>> {
    return this.http.post<ApiResponse<Order>>(this.api, payload);
  }

  getMyOrders(page: number = 1, limit: number = 10): Observable<PaginatedResponse<Order>> {
    return this.http.get<PaginatedResponse<Order>>(`${this.api}/my`, { params: { page, limit } });
  }

  getMyOrderById(id: string): Observable<ApiResponse<Order>> {
    return this.http.get<ApiResponse<Order>>(`${this.api}/my/${id}`);
  }

  cancelMyOrder(id: string, reason?: string): Observable<ApiResponse<Order>> {
    return this.http.patch<ApiResponse<Order>>(`${this.api}/my/${id}/cancel`, { reason });
  }

  getAdminOrders(query: AdminOrderQuery): Observable<PaginatedResponse<Order>> {
    const params: any = { ...query };
    return this.http.get<PaginatedResponse<Order>>(`${this.api}/admin`, { params });
  }

  getAdminOrderById(id: string): Observable<ApiResponse<Order>> {
    return this.http.get<ApiResponse<Order>>(`${this.api}/admin/${id}`);
  }

  updateOrderStatus(id: string, payload: UpdateOrderStatusPayload): Observable<ApiResponse<Order>> {
    return this.http.patch<ApiResponse<Order>>(`${this.api}/admin/${id}/status`, payload);
  }

  getSalesReport(dateFrom?: string, dateTo?: string): Observable<ApiResponse<SalesReport>> {
    const params: any = {};
    if (dateFrom) params.dateFrom = dateFrom;
    if (dateTo) params.dateTo = dateTo;
    return this.http.get<ApiResponse<SalesReport>>(`${this.api}/admin/reports/sales`, { params });
  }

  getNotifications(): Observable<ApiResponse<NotificationCounts>> {
    return this.http.get<ApiResponse<NotificationCounts>>(`${this.api}/admin/notifications`);
  }
}