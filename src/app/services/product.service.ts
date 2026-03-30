import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Product, ProductListResponse } from '../interfaces/product.model';
import { ApiResponse } from '../interfaces/Response.model';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class ProductService {
  constructor(private http: HttpClient) {}

  getProducts(page = 1, limit = 12): Observable<ApiResponse<ProductListResponse>> {
    return this.http.get<ApiResponse<ProductListResponse>>(
      `${environment.apiUrl}/store/products`, { params: { page, limit } }
    );
  }

  getProductBySlug(slug: string): Observable<ApiResponse<Product>> {
    return this.http.get<ApiResponse<Product>>(
      `${environment.apiUrl}/store/products/${slug}`
    );
  }
}
