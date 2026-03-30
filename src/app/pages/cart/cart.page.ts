import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { IonContent } from '@ionic/angular/standalone';
import { CartService } from '../../services/cart.service';
import { ToastService } from '../../services/toast.service';
import { Cart, CartItem } from '../../interfaces/cart.model';
import { NavbarComponent } from '../../shared/navbar/navbar.component';
import { FooterComponent } from '../../shared/footer/footer.component';
import { ToastContainerComponent } from '../../shared/toast-container/toast-container.component';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, RouterLink, IonContent, NavbarComponent, FooterComponent, ToastContainerComponent],
  templateUrl: './cart.page.html',
})
export class CartPage implements OnInit {
  cart: Cart | null = null;
  isLoading = true;
  removingItemId: number | null = null;

  constructor(
    private cartService: CartService,
    private toast: ToastService,
  ) {}

  ngOnInit() {
    this.isLoading = true;
    this.cartService.cart$.subscribe(cart => {
      this.cart = cart;
      this.isLoading = false;
    });
    this.cartService.fetchCart().subscribe();
  }

  get items(): CartItem[] {
    return this.cart?.items ?? [];
  }

  get total(): number {
    return this.items.reduce((acc, item) => {
      const price = Number(item.product.price);
      return acc + (isNaN(price) ? 0 : price * item.quantity);
    }, 0);
  }

  async removeItem(itemId: number) {
    this.removingItemId = itemId;
    try {
      const obs = await this.cartService.removeFromCart(itemId);
      obs.subscribe({
        next: () => {
          this.toast.show('Item removed from cart', 2000, 'info');
          this.removingItemId = null;
        },
        error: () => {
          this.toast.show('Could not remove item', 3000, 'error');
          this.removingItemId = null;
        }
      });
    } catch {
      this.removingItemId = null;
    }
  }

  getProductImage(item: CartItem): string {
    return 'https://placehold.co/80x80/f1f5f9/94a3b8?text=' + encodeURIComponent(item.product.name);
  }
}
