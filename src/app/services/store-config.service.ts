import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { tap, catchError, map } from 'rxjs/operators';
import { StoreConfig } from '../interfaces/store-config.model';
import { environment } from '../../environments/environment';

/** Hard-coded domain for this storefront deployment */
export const STORE_DOMAIN = 'store1.com';

/** Safe fallback configuration – used when the API is unreachable */
const DEFAULT_CONFIG: StoreConfig = {
  domain: STORE_DOMAIN,
  tenant_id: '',
  brand: {
    store_name: 'My Store',
    store_tagline: 'Best products, delivered fast.',
    logo_url: null,
    favicon_url: null,
  },
  theme: {
    primary_color: '#4f46e5',
    accent_color: '#f59e0b',
    background_style: 'light',
    font_family: 'Inter',
  },
  hero: {
    promo_badge: 'Free Shipping',
    headline: 'Discover Products You\'ll Love',
    sub_headline: 'Curated premium products with fast delivery. Shop the latest trends at unbeatable prices.',
    hero_image_url: null,
  },
  layout: {
    show_hero: true,
    show_trust_signals: true,
    show_featured_products: true,
  },
  footer: {
    social_links: {},
    contact_info: {},
    copyright: `© ${new Date().getFullYear()} My Store. All rights reserved.`,
  },
};

@Injectable({ providedIn: 'root' })
export class StoreConfigService {
  private configSubject = new BehaviorSubject<StoreConfig>(DEFAULT_CONFIG);
  public config$ = this.configSubject.asObservable();

  constructor(private http: HttpClient) {}

  /** Call once during app bootstrap (see app.component.ts) */
  loadConfig(): Observable<StoreConfig> {
    const url = `${environment.apiUrl}/store/config?domain=${STORE_DOMAIN}`;
    return this.http.get<{ status: number; message: string; data: StoreConfig }>(url).pipe(
      map(res => res.data),
      tap(config => {
        this.configSubject.next(config);
        this.applyTheme(config);
        this.applyBrand(config);
      }),
      catchError(() => {
        // Silently fall back to defaults – the UI will still render
        this.applyTheme(DEFAULT_CONFIG);
        this.applyBrand(DEFAULT_CONFIG);
        return of(DEFAULT_CONFIG);
      })
    );
  }

  private applyTheme(config: StoreConfig): void {
    const root = document.documentElement;
    root.style.setProperty('--primary-color', config.theme.primary_color);
    root.style.setProperty('--accent-color', config.theme.accent_color);
    root.style.setProperty('--font-family', config.theme.font_family);
    // Font injection via Google Fonts
    this.injectGoogleFont(config.theme.font_family);
  }

  private applyBrand(config: StoreConfig): void {
    // Page title
    document.title = config.brand.store_name;
    // Favicon
    if (config.brand.favicon_url) {
      let link: HTMLLinkElement = document.querySelector("link[rel~='icon']") as HTMLLinkElement;
      if (!link) {
        link = document.createElement('link');
        link.rel = 'icon';
        document.head.appendChild(link);
      }
      link.href = config.brand.favicon_url;
    }
  }

  private injectGoogleFont(fontFamily: string): void {
    const id = 'dynamic-google-font';
    const existing = document.getElementById(id);
    if (existing) existing.remove();
    const link = document.createElement('link');
    link.id = id;
    link.rel = 'stylesheet';
    link.href = `https://fonts.googleapis.com/css2?family=${fontFamily.replace(/ /g, '+')}:wght@300;400;500;600;700&display=swap`;
    document.head.appendChild(link);
  }

  get currentConfig(): StoreConfig {
    return this.configSubject.value;
  }
}
