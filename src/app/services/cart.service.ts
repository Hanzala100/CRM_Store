import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { Cart } from '../interfaces/cart.model';
import { ApiResponse } from '../interfaces/Response.model';
import { environment } from '../../environments/environment';
import { PersistenceService } from './persistence.service';
import { AuthService } from './auth.service';

@Injectable({ providedIn: 'root' })
export class CartService {
  private cartSubject = new BehaviorSubject<Cart | null>(null);
  public cart$ = this.cartSubject.asObservable();

  private readonly GUEST_ID_KEY = 'sf_guest_id';
  private guestId: string = '';

  constructor(
    private http: HttpClient,
    private persistence: PersistenceService,
    private authService: AuthService
  ) {
    this.initGuestId();
  }

  private async initGuestId() {
    let id = await this.persistence.get<string>(this.GUEST_ID_KEY);
    if (!id) {
      id = this.generateUUID();
      await this.persistence.set(this.GUEST_ID_KEY, id);
    }
    this.guestId = id!;
  }

  private generateUUID(): string {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
      const r = (Math.random() * 16) | 0;
      return (c === 'x' ? r : (r & 0x3) | 0x8).toString(16);
    });
  }

  private async buildHeaders(): Promise<HttpHeaders> {
    const token = await this.authService.getAccessToken();
    let headers = new HttpHeaders({ 'x-guest-id': this.guestId });
    if (token) headers = headers.set('Authorization', `Bearer ${token}`);
    return headers;
  }

  async fetchCart(): Promise<void> {
    const headers = await this.buildHeaders();
    this.http.get<ApiResponse<Cart>>(
      `${environment.apiUrl}/store/cart`, { headers }
    ).subscribe(res => {
      if (res.success) this.cartSubject.next(res.data);
    });
  }

  async addToCart(productId: number, quantity: number): Promise<Observable<ApiResponse<Cart>>> {
    const headers = await this.buildHeaders();
    return this.http.post<ApiResponse<Cart>>(
      `${environment.apiUrl}/store/cart`,
      { productId, quantity },
      { headers }
    ).pipe(
      tap(res => { if (res.success) this.cartSubject.next(res.data); })
    );
  }

  async removeFromCart(itemId: number): Promise<Observable<ApiResponse<any>>> {
    const headers = await this.buildHeaders();
    return this.http.delete<ApiResponse<any>>(
      `${environment.apiUrl}/store/cart/${itemId}`,
      { headers }
    ).pipe(
      tap(res => { if (res.success) this.fetchCart(); })
    );
  }

  async syncCart(): Promise<void> {
    const headers = await this.buildHeaders();
    this.http.post<ApiResponse<Cart>>(
      `${environment.apiUrl}/store/cart/sync`, {}, { headers }
    ).subscribe(res => {
      if (res.success) this.cartSubject.next(res.data);
    });
  }

  get cartItemCount(): number {
    return this.cartSubject.value?.items?.length ?? 0;
  }

  get cartTotal(): number {
    return this.cartSubject.value?.total ?? 0;
  }
}
