import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { StaticPage, ApiResponse } from '../models';

@Injectable({ providedIn: 'root' })
export class PageService {
  private http = inject(HttpClient);
  private api = `${environment.apiUrl}/pages`;

  getPage(key: string): Observable<ApiResponse<StaticPage>> {
    return this.http.get<ApiResponse<StaticPage>>(`${this.api}/${key}`);
  }

  updateAboutUs(title: string, body: string): Observable<ApiResponse<StaticPage>> {
    return this.http.put<ApiResponse<StaticPage>>(`${this.api}/admin/about_us`, { title, body });
  }

  updateFaq(items: any[]): Observable<ApiResponse<StaticPage>> {
    return this.http.put<ApiResponse<StaticPage>>(`${this.api}/admin/faq`, { items });
  }

  updateContactUs(data: any): Observable<ApiResponse<StaticPage>> {
    return this.http.put<ApiResponse<StaticPage>>(`${this.api}/admin/contact_us`, data);
  }
}