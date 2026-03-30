import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';
import { StoreTheme } from '../interfaces/theme.model';
import { ApiResponse } from '../interfaces/Response.model';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  private themeSubject = new BehaviorSubject<StoreTheme | null>(null);
  public theme$ = this.themeSubject.asObservable();

  // Default theme values
  private defaults: StoreTheme = {
    primary_color: '#4f46e5',
    logo_url: null,
    banner_url: null,
    layout_config: { hero: true }
  };

  constructor(private http: HttpClient) {}

  loadTheme(): void {
    this.http.get<ApiResponse<StoreTheme>>(`${environment.apiUrl}/store/theme`)
      .subscribe({
        next: (res) => {
          if (res.success) {
            this.applyTheme(res.data);
          } else {
            this.applyTheme(this.defaults);
          }
        },
        error: () => {
          this.applyTheme(this.defaults);
        }
      });
  }

  private applyTheme(theme: StoreTheme): void {
    this.themeSubject.next(theme);
    const root = document.documentElement;
    root.style.setProperty('--primary-color', theme.primary_color || '#4f46e5');
    // Derive a lighter version for accents
    root.style.setProperty('--accent-color', theme.primary_color || '#4f46e5');
  }

  get currentTheme(): StoreTheme {
    return this.themeSubject.value ?? this.defaults;
  }
}
