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
    private cartService: CartService,
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
      const obs = await this.cartService.addToCart(product.id, 1);
      obs.subscribe({
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

  getFirstImage(product: Product): string {
    return (product.images && product.images.length > 0)
      ? product.images[0]
      : 'https://placehold.co/400x300/f1f5f9/94a3b8?text=' + encodeURIComponent(product.name);
  }
}