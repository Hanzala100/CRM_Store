import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { IonContent } from '@ionic/angular/standalone';
import { AuthUser } from '../../interfaces/auth.model';
import { NavbarComponent } from '../../shared/navbar/navbar.component';
import { FooterComponent } from '../../shared/footer/footer.component';
import { ToastContainerComponent } from '../../shared/toast-container/toast-container.component';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, RouterLink, IonContent, NavbarComponent, FooterComponent, ToastContainerComponent],
  templateUrl: './profile.page.html',
})
export class ProfilePage implements OnInit {
  user: AuthUser | null = null;

  constructor(
    private authService: AuthService,
    private toast: ToastService,
    private router: Router
  ) {}

  ngOnInit() {
    this.user = this.authService.currentUser;
    if (!this.user) {
      this.router.navigate(['/login']);
    }
  }

  async logout() {
    await this.authService.logout();
    this.toast.show('Logged out successfully', 2000, 'info');
    this.router.navigate(['/home']);
  }
}
