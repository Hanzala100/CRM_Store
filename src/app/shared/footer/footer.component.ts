import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { StoreConfigService } from '../../services/store-config.service';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [RouterLink, CommonModule],
  template: `
    <ng-container *ngIf="storeConfig.config$ | async as config">
      <footer class="bg-slate-50 border-t border-slate-200 mt-24">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-8">
            <!-- Brand -->
            <div class="flex flex-col gap-2">
              <div class="flex items-center gap-2">
                <div *ngIf="!config.brand.logo_url" class="w-8 h-8 bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center">
                  <span class="text-white font-bold text-sm">{{config.brand.store_name[0] || 'S'}}</span>
                </div>
                <img *ngIf="config.brand.logo_url" [src]="config.brand.logo_url" alt="Logo" class="max-w-[120px] max-h-8 object-contain">
                <span class="text-slate-900 font-semibold text-lg">{{config.brand.store_name}}</span>
              </div>
              <p class="text-slate-500 text-sm">{{config.brand.store_tagline}}</p>
            </div>

            <!-- Links & Contact Info -->
            <div class="flex flex-wrap gap-8 text-sm text-slate-500">
              <div class="flex flex-col gap-2" *ngIf="config.footer.contact_info.email || config.footer.contact_info.phone">
                <span class="font-semibold text-slate-900">Contact Us</span>
                <a *ngIf="config.footer.contact_info.email" [href]="'mailto:' + config.footer.contact_info.email" class="hover:text-primary transition-colors">{{config.footer.contact_info.email}}</a>
                <a *ngIf="config.footer.contact_info.phone" [href]="'tel:' + config.footer.contact_info.phone" class="hover:text-primary transition-colors">{{config.footer.contact_info.phone}}</a>
              </div>
              <div class="flex flex-col gap-2">
                <span class="font-semibold text-slate-900">Quick Links</span>
                <a routerLink="/home" class="hover:text-primary transition-colors">Home</a>
                <a routerLink="/cart" class="hover:text-primary transition-colors">Cart</a>
              </div>
              <div class="flex flex-col gap-2" *ngIf="config.footer.social_links.facebook || config.footer.social_links.instagram || config.footer.social_links.twitter">
                <span class="font-semibold text-slate-900">Follow Us</span>
                <div class="flex gap-4">
                  <a *ngIf="config.footer.social_links.facebook" [href]="config.footer.social_links.facebook" target="_blank" class="hover:text-primary transition-colors">Facebook</a>
                  <a *ngIf="config.footer.social_links.instagram" [href]="config.footer.social_links.instagram" target="_blank" class="hover:text-primary transition-colors">Instagram</a>
                  <a *ngIf="config.footer.social_links.twitter" [href]="config.footer.social_links.twitter" target="_blank" class="hover:text-primary transition-colors">Twitter</a>
                </div>
              </div>
            </div>
          </div>

          <div class="mt-10 pt-8 border-t border-slate-200 text-center text-xs text-slate-400">
            {{config.footer.copyright || '&copy; ' + currentYear + ' ' + config.brand.store_name + '. All rights reserved.'}}
          </div>
        </div>
      </footer>
    </ng-container>
  `
})
export class FooterComponent {
  currentYear = new Date().getFullYear();
  constructor(public storeConfig: StoreConfigService) {}
}
