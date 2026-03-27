import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, switchMap, distinctUntilChanged, of, catchError, tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import { STORAGE_KEYS } from '../constants/app.constants';
import { Cart, ApiResponse, GuestCartItem } from '../models';
import { AuthService } from './auth';

@Injectable({ providedIn: 'root' })
export class CartService {
  private http = inject(HttpClient);
  private auth = inject(AuthService);
  private api = `${environment.apiUrl}/cart`;

  private cartSubject = new BehaviorSubject<Cart | null>(null);
  private countSubject = new BehaviorSubject<number>(this.getGuestCount());
  cart$ = this.cartSubject.asObservable();
  itemCount$ = this.countSubject.asObservable();

  constructor() {
    this.auth.isLoggedIn$.pipe(
      distinctUntilChanged(),
      switchMap(isLoggedIn => {
        if (!isLoggedIn) {
          this.cartSubject.next(null);
          this.countSubject.next(this.getGuestCount());
          return of(null);
        }
        return this.loadCart().pipe(catchError(() => of(null)));
      })
    ).subscribe();
  }

  loadCart(): Observable<ApiResponse<Cart>> {
    return this.http.get<ApiResponse<Cart>>(this.api).pipe(
      tap(res => this.setCart(res.data))
    );
  }

  addItem(productId: string, quantity: number): Observable<ApiResponse<Cart>> {
    return this.http.post<ApiResponse<Cart>>(`${this.api}/items`, { productId, quantity }).pipe(
      tap(res => this.setCart(res.data))
    );
  }

  updateItem(productId: string, quantity: number): Observable<ApiResponse<Cart>> {
    return this.http.put<ApiResponse<Cart>>(`${this.api}/items/${productId}`, { quantity }).pipe(
      tap(res => this.setCart(res.data))
    );
  }

  removeItem(productId: string): Observable<ApiResponse<Cart>> {
    return this.http.delete<ApiResponse<Cart>>(`${this.api}/items/${productId}`).pipe(
      tap(res => this.setCart(res.data))
    );
  }

  clearCart(): Observable<ApiResponse<null>> {
    return this.http.delete<ApiResponse<null>>(this.api).pipe(
      tap(() => {
        this.cartSubject.next(null);
        this.countSubject.next(0);
      })
    );
  }

  mergeGuestCart(items: GuestCartItem[]): Observable<ApiResponse<Cart>> {
    return this.http.post<ApiResponse<Cart>>(`${this.api}/merge`, { items }).pipe(
      tap(res => {
        this.setCart(res.data);
        this.clearGuestCart();
      })
    );
  }

  confirmPrice(productId: string | 'all'): Observable<ApiResponse<Cart>> {
    return this.http.patch<ApiResponse<Cart>>(`${this.api}/confirm-price/${productId}`, {}).pipe(
      tap(res => this.setCart(res.data))
    );
  }

  getGuestCart(): GuestCartItem[] {
    try {
      const raw = localStorage.getItem(STORAGE_KEYS.GUEST_CART);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  }

  addToGuestCart(productId: string, quantity: number): void {
    const items = this.getGuestCart();
    const idx = items.findIndex(i => i.productId === productId);
    if (idx >= 0) items[idx].quantity += quantity;
    else items.push({ productId, quantity });
    this.saveGuestCart(items);
  }

  updateGuestCartItem(productId: string, quantity: number): void {
    const items = this.getGuestCart().map(i => i.productId === productId ? { ...i, quantity } : i);
    this.saveGuestCart(items);
  }

  removeGuestCartItem(productId: string): void {
    const items = this.getGuestCart().filter(i => i.productId !== productId);
    this.saveGuestCart(items);
  }

  clearGuestCart(): void {
    localStorage.removeItem(STORAGE_KEYS.GUEST_CART);
    this.countSubject.next(0);
  }

  private setCart(cart: Cart): void {
    this.cartSubject.next(cart);
    this.countSubject.next(cart.itemCount);
  }

  private saveGuestCart(items: GuestCartItem[]): void {
    localStorage.setItem(STORAGE_KEYS.GUEST_CART, JSON.stringify(items));
    this.countSubject.next(items.reduce((s, i) => s + i.quantity, 0));
  }

  private getGuestCount(): number {
    return this.getGuestCart().reduce((s, i) => s + i.quantity, 0);
  }
}