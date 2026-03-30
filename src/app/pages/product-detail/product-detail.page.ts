import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { IonContent } from '@ionic/angular/standalone';
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
  imports: [CommonModule, RouterLink, IonContent, NavbarComponent, FooterComponent, ToastContainerComponent],
  templateUrl: './product-detail.page.html',
})
export class ProductDetailPage implements OnInit {
  product: Product | null = null;
  isLoading = true;
  isAddingToCart = false;
  quantity = 1;
  selectedImageIndex = 0;

  constructor(
    private route: ActivatedRoute,
    private productService: ProductService,
    public cartService: CartService,
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
          this.selectedImageIndex = 0;
          // Sync local quantity with cart
          const cartQty = this.cartService.getProductQuantity(this.product.id);
          this.quantity = cartQty > 0 ? cartQty : 1;
        }
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
        this.toast.show('Failed to load product', 3000, 'error');
      }
    });
  }

  get selectedImage(): string {
    if (this.product && this.product.images && this.product.images.length > 0) {
      return this.product.images[this.selectedImageIndex];
    }
    return 'https://placehold.co/600x500/f1f5f9/94a3b8?text=' + encodeURIComponent(this.product?.name ?? 'Product');
  }

  selectImage(index: number) {
    this.selectedImageIndex = index;
  }

  nextImage() {
    if (this.product && this.product.images) {
      this.selectedImageIndex = (this.selectedImageIndex + 1) % this.product.images.length;
    }
  }

  prevImage() {
    if (this.product && this.product.images) {
      this.selectedImageIndex = (this.selectedImageIndex - 1 + this.product.images.length) % this.product.images.length;
    }
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
      const currentQty = this.cartService.getProductQuantity(this.product.id);
      // Delta to reach the target quantity
      const delta = this.quantity - currentQty;
      
      if (delta === 0) {
        this.isAddingToCart = false;
        return;
      }

      (await this.cartService.addToCart(this.product.id, delta)).subscribe({
        next: (res) => {
          if (res.success) {
            this.toast.show(currentQty === 0 ? `"${this.product!.name}" added to cart!` : 'Cart updated!', 2500, 'success');
          }
          this.isAddingToCart = false;
        },
        error: () => {
          this.toast.show('Could not update cart', 3000, 'error');
          this.isAddingToCart = false;
        }
      });
    } catch {
      this.isAddingToCart = false;
    }
  }

  async removeItem() {
    if (!this.product) return;
    const itemId = this.cartService.getCartItemId(this.product.id);
    if (!itemId) return;

    this.isAddingToCart = true;
    (await this.cartService.removeFromCart(itemId)).subscribe({
      next: () => {
        this.toast.show(`Removed "${this.product!.name}" from cart`, 2000, 'info');
        this.quantity = 1;
        this.isAddingToCart = false;
      },
      error: () => {
        this.toast.show('Could not remove item', 3000, 'error');
        this.isAddingToCart = false;
      }
    });
  }

  isInCart(): boolean {
    return this.product ? this.cartService.getProductQuantity(this.product.id) > 0 : false;
  }
}
