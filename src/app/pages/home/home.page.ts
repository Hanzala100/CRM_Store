import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { IonContent } from '@ionic/angular/standalone';
import { ProductService } from '../../services/product.service';
import { AuthService } from '../../services/auth.service';
import { CartService } from '../../services/cart.service';
import { ToastService } from '../../services/toast.service';
import { Product } from '../../interfaces/product.model';
import { NavbarComponent } from '../../shared/navbar/navbar.component';
import { FooterComponent } from '../../shared/footer/footer.component';
import { SkeletonCardComponent } from '../../shared/skeleton-card/skeleton-card.component';
import { ToastContainerComponent } from '../../shared/toast-container/toast-container.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    IonContent,
    NavbarComponent,
    FooterComponent,
    SkeletonCardComponent,
    ToastContainerComponent,
  ],
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {
  products: Product[] = [];
  isLoading = true;
  addingToCartId: number | null = null;

  skeletons = Array(8).fill(0);

  constructor(
    private productService: ProductService,
    private authService: AuthService,
    public cartService: CartService,
    private toast: ToastService,
  ) {}

  ngOnInit() {
    // Refresh data whenever user state changes (login/logout)
    this.authService.user$.subscribe(() => {
      this.loadProducts();
      this.cartService.fetchCart().subscribe();
    });
  }

  loadProducts() {
    this.isLoading = true;
    this.productService.getProducts(1, 12).subscribe({
      next: (res) => {
        if (res.success) {
          const data = res.data as any;
          this.products = data?.products || data?.rows || (Array.isArray(data) ? data : []);
        }
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
        this.toast.show('Failed to load products', 3000, 'error');
      },
    });
  }

  async addToCart(product: Product) {
    this.addingToCartId = product.id;
    try {
      (await this.cartService.addToCart(product.id, 1)).subscribe({
        next: (res) => {
          if (res.success) this.toast.show(`"${product.name}" added to cart!`, 2500, 'success');
          this.addingToCartId = null;
        },
        error: () => {
          this.toast.show('Could not add to cart', 3000, 'error');
          this.addingToCartId = null;
        },
      });
    } catch {
      this.addingToCartId = null;
    }
  }

  async updateQuantity(product: Product, delta: number) {
    const currentQty = this.cartService.getProductQuantity(product.id);
    const newQty = currentQty + delta;

    if (newQty <= 0) {
      const itemId = this.cartService.getCartItemId(product.id);
      if (itemId) {
        this.addingToCartId = product.id;
        (await this.cartService.removeFromCart(itemId)).subscribe({
          next: () => {
            this.toast.show(`Removed "${product.name}" from cart`, 2000, 'info');
            this.addingToCartId = null;
          },
          error: () => {
            this.toast.show('Could not remove item', 3000, 'error');
            this.addingToCartId = null;
          }
        });
      }
    } else {
      this.addingToCartId = product.id;
      // Note: Assumes API addToCart with 1 increments, and -1 decrements
      (await this.cartService.addToCart(product.id, delta)).subscribe({
        next: () => {
          this.addingToCartId = null;
        },
        error: () => {
          this.toast.show('Could not update quantity', 3000, 'error');
          this.addingToCartId = null;
        }
      });
    }
  }

  getQuantity(productId: number): number {
    return this.cartService.getProductQuantity(productId);
  }

  getFirstImage(product: Product): string {
    return (product.images && product.images.length > 0)
      ? product.images[0]
      : 'https://placehold.co/400x300/f1f5f9/94a3b8?text=' + encodeURIComponent(product.name);
  }
}