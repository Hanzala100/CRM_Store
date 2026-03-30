import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { IonContent } from '@ionic/angular/standalone';
import { AuthService } from '../../services/auth.service';
import { CartService } from '../../services/cart.service';
import { ToastService } from '../../services/toast.service';
import { ToastContainerComponent } from '../../shared/toast-container/toast-container.component';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, IonContent, ToastContainerComponent],
  templateUrl: './login.page.html',
})
export class LoginPage {
  email = '';
  password = '';
  tenantId = 1;
  isLoading = false;
  showPassword = false;

  constructor(
    private authService: AuthService,
    private cartService: CartService,
    private toast: ToastService,
    private router: Router
  ) {}

  async login() {
    if (!this.email || !this.password) {
      this.toast.show('Please fill in all fields', 3000, 'warning');
      return;
    }
    this.isLoading = true;
    this.authService.login({ email: this.email, password: this.password, tenantId: this.tenantId })
      .subscribe({
        next: async (res) => {
          if (res.success) {
            await this.cartService.syncCart();
            this.toast.show('Welcome back!', 2500, 'success');
            this.router.navigate(['/home']);
          }
          this.isLoading = false;
        },
        error: (err) => {
          const msg = err?.error?.message ?? 'Invalid credentials';
          this.toast.show(msg, 4000, 'error');
          this.isLoading = false;
        }
      });
  }
}
