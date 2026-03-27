import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Product, ProductsResponse, ProductQuery, ApiResponse, AdminProductQuery, AdminProductsResponse } from '../models';

@Injectable({ providedIn: 'root' })
export class ProductService {
  private http = inject(HttpClient);
  private api = `${environment.apiUrl}/products`;

  getProducts(query: ProductQuery): Observable<ProductsResponse> {
    const params: any = { ...query };
    return this.http.get<ProductsResponse>(this.api, { params });
  }

  getProductBySlug(slug: string): Observable<ApiResponse<Product>> {
    return this.http.get<ApiResponse<Product>>(`${this.api}/${slug}`);
  }

  getAdminProducts(query: AdminProductQuery): Observable<AdminProductsResponse> {
    const params: any = { ...query };
    return this.http.get<AdminProductsResponse>(`${this.api}/admin/all`, { params });
  }

  createProduct(formData: FormData): Observable<ApiResponse<Product>> {
    return this.http.post<ApiResponse<Product>>(this.api, formData);
  }

  updateProduct(id: string, formData: FormData): Observable<ApiResponse<Product>> {
    return this.http.put<ApiResponse<Product>>(`${this.api}/${id}`, formData);
  }

  deleteProduct(id: string): Observable<ApiResponse<null>> {
    return this.http.delete<ApiResponse<null>>(`${this.api}/${id}`);
  }

  getImageUrl(filename: string): string {
    return `${environment.uploadsUrl}/products/${filename}`;
  }
}