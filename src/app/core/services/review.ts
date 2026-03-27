import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Review, CreateReviewPayload, ApiResponse, PaginatedResponse } from '../models';

@Injectable({ providedIn: 'root' })
export class ReviewService {
  private http = inject(HttpClient);
  private api = `${environment.apiUrl}/reviews`;

  getApprovedReviews(): Observable<ApiResponse<Review[]>> {
    return this.http.get<ApiResponse<Review[]>>(`${this.api}/approved`);
  }

  createReview(payload: CreateReviewPayload): Observable<ApiResponse<Review>> {
    return this.http.post<ApiResponse<Review>>(this.api, payload);
  }

  getAdminReviews(status?: string, page: number = 1, limit: number = 20): Observable<PaginatedResponse<Review>> {
    const params: any = { page, limit };
    if (status) params.status = status;
    return this.http.get<PaginatedResponse<Review>>(`${this.api}/admin`, { params });
  }

  updateReviewStatus(id: string, status: string): Observable<ApiResponse<Review>> {
    return this.http.patch<ApiResponse<Review>>(`${this.api}/admin/${id}`, { status });
  }
}