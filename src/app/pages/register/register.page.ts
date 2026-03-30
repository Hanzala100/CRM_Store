import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { IonContent } from '@ionic/angular/standalone';
import { AuthService } from '../../services/auth.service';
import { ToastService } from '../../services/toast.service';
import { ToastContainerComponent } from '../../shared/toast-container/toast-container.component';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, IonContent, ToastContainerComponent],
  templateUrl: './register.page.html',
})
export class RegisterPage {
  email = '';
  password = '';
  confirmPassword = '';
  tenantId = 1;
  isLoading = false;
  showPassword = false;

  constructor(
    private authService: AuthService,
    private toast: ToastService,
    private router: Router
  ) {}

  register() {
    if (!this.email || !this.password || !this.confirmPassword) {
      this.toast.show('Please fill in all fields', 3000, 'warning');
      return;
    }
    if (this.password !== this.confirmPassword) {
      this.toast.show('Passwords do not match', 3000, 'error');
      return;
    }
    if (this.password.length < 8) {
      this.toast.show('Password must be at least 8 characters', 3000, 'warning');
      return;
    }
    this.isLoading = true;
    this.authService.register({ email: this.email, password: this.password, role: 'customer', tenantId: this.tenantId })
      .subscribe({
        next: (res) => {
          if (res.success) {
            this.toast.show('Account created! Please sign in.', 3000, 'success');
            this.router.navigate(['/login']);
          }
          this.isLoading = false;
        },
        error: (err) => {
          const msg = err?.error?.message ?? 'Registration failed';
          this.toast.show(msg, 4000, 'error');
          this.isLoading = false;
        }
      });
  }
}
