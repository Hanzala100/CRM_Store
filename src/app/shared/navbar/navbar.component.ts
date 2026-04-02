import { Component, OnInit } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { CartService } from '../../services/cart.service';
import { Router } from '@angular/router';
import { StoreConfigService } from '../../services/store-config.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {
  isMenuOpen = false;
  cartCount = 0;

  constructor(
    public authService: AuthService,
    public cartService: CartService,
    public storeConfigService: StoreConfigService,
    private router: Router
  ) {}

  ngOnInit() {
    this.cartService.cart$.subscribe(cart => {
      this.cartCount = cart?.items?.length ?? 0;
    });
  }

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }

  async logout() {
    await this.authService.logout();
    this.cartService.fetchCart().subscribe(); // Clear/refresh cart
    this.router.navigate(['/home']);
  }
}
