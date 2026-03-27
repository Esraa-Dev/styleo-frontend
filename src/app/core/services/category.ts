import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Category, ApiResponse } from '../models';

@Injectable({ providedIn: 'root' })
export class CategoryService {
  private http = inject(HttpClient);
  private api = `${environment.apiUrl}/categories`;

  getCategories(): Observable<ApiResponse<Category[]>> {
    return this.http.get<ApiResponse<Category[]>>(this.api);
  }

  getAdminCategories(): Observable<ApiResponse<Category[]>> {
    return this.http.get<ApiResponse<Category[]>>(`${this.api}/admin`);
  }

  createCategory(data: { name: string; isActive?: boolean }): Observable<ApiResponse<Category>> {
    return this.http.post<ApiResponse<Category>>(this.api, data);
  }

  updateCategory(id: string, data: { name?: string }): Observable<ApiResponse<Category>> {
    return this.http.put<ApiResponse<Category>>(`${this.api}/${id}`, data);
  }

  deleteCategory(id: string): Observable<ApiResponse<null>> {
    return this.http.delete<ApiResponse<null>>(`${this.api}/${id}`);
  }

  createSubcategory(categoryId: string, data: { name: string; isActive?: boolean }): Observable<ApiResponse<any>> {
    return this.http.post<ApiResponse<any>>(`${this.api}/${categoryId}/subcategories`, data);
  }

  updateSubcategory(categoryId: string, subId: string, data: { name?: string }): Observable<ApiResponse<any>> {
    return this.http.put<ApiResponse<any>>(`${this.api}/${categoryId}/subcategories/${subId}`, data);
  }

  deleteSubcategory(categoryId: string, subId: string): Observable<ApiResponse<null>> {
    return this.http.delete<ApiResponse<null>>(`${this.api}/${categoryId}/subcategories/${subId}`);
  }
}