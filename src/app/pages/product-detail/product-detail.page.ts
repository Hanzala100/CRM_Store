import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ProductService } from '../../services/product.service';
import { CartService } from '../../services/cart.service';
import { ToastService } from '../../services/toast.service';
import { Product } from '../../interfaces/product.model';
import { NavbarComponent } from '../../shared/navbar/navbar.component';
import { FooterComponent } from '../../shared/footer/footer.component';
import { ToastContainerComponent } from '../../shared/toast-container/toast-container.component';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [CommonModule, RouterLink, NavbarComponent, FooterComponent, ToastContainerComponent],
  templateUrl: './product-detail.page.html',
})
export class ProductDetailPage implements OnInit {
  product: Product | null = null;
  isLoading = true;
  isAddingToCart = false;
  quantity = 1;
  selectedImage = '';

  constructor(
    private route: ActivatedRoute,
    private productService: ProductService,
    private cartService: CartService,
    private toast: ToastService,
  ) {}

  ngOnInit() {
    this.route.params.subscribe(params => {
      if (params['slug']) this.loadProduct(params['slug']);
    });
  }

  loadProduct(slug: string) {
    this.isLoading = true;
    this.productService.getProductBySlug(slug).subscribe({
      next: (res) => {
        if (res.success) {
          this.product = res.data;
          this.selectedImage = this.getFirstImage(res.data);
        }
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
        this.toast.show('Failed to load product', 3000, 'error');
      }
    });
  }

  getFirstImage(product: Product): string {
    return (product.images && product.images.length > 0)
      ? product.images[0]
      : 'https://placehold.co/600x500/f1f5f9/94a3b8?text=' + encodeURIComponent(product?.name ?? 'Product');
  }

  selectImage(img: string) {
    this.selectedImage = img;
  }

  increment() {
    if (this.product && this.quantity < this.product.stock) this.quantity++;
  }

  decrement() {
    if (this.quantity > 1) this.quantity--;
  }

  async addToCart() {
    if (!this.product) return;
    this.isAddingToCart = true;
    try {
      const obs = await this.cartService.addToCart(this.product.id, this.quantity);
      obs.subscribe({
        next: (res) => {
          if (res.success) this.toast.show(`"${this.product!.name}" added to cart!`, 2500, 'success');
          this.isAddingToCart = false;
        },
        error: () => {
          this.toast.show('Could not add to cart', 3000, 'error');
          this.isAddingToCart = false;
        }
      });
    } catch {
      this.isAddingToCart = false;
    }
  }
}
