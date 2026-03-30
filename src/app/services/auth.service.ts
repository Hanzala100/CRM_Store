import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { PersistenceService } from './persistence.service';
import { AuthData, LoginRequest, RegisterRequest, AuthUser } from '../interfaces/auth.model';
import { ApiResponse } from '../interfaces/Response.model';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private userSubject = new BehaviorSubject<AuthUser | null>(null);
  public user$ = this.userSubject.asObservable();

  private readonly ACCESS_TOKEN_KEY = 'sf_access_token';
  private readonly REFRESH_TOKEN_KEY = 'sf_refresh_token';
  private readonly USER_KEY = 'sf_user';

  constructor(
    private http: HttpClient,
    private persistence: PersistenceService
  ) {
    this.loadFromStorage();
  }

  private async loadFromStorage() {
    const user = await this.persistence.get<AuthUser>(this.USER_KEY);
    if (user) this.userSubject.next(user);
  }

  get isLoggedIn(): boolean {
    return !!this.userSubject.value;
  }

  get currentUser(): AuthUser | null {
    return this.userSubject.value;
  }

  async getAccessToken(): Promise<string | null> {
    return this.persistence.get<string>(this.ACCESS_TOKEN_KEY);
  }

  async getRefreshToken(): Promise<string | null> {
    return this.persistence.get<string>(this.REFRESH_TOKEN_KEY);
  }

  login(payload: LoginRequest): Observable<ApiResponse<AuthData>> {
    return this.http.post<ApiResponse<AuthData>>(
      `${environment.apiUrl}/auth/customer/login`, payload
    ).pipe(
      tap(async (res) => {
        if (res.success) {
          await this.persistence.set(this.ACCESS_TOKEN_KEY, res.data.accessToken);
          await this.persistence.set(this.REFRESH_TOKEN_KEY, res.data.refreshToken);
          await this.persistence.set(this.USER_KEY, res.data.user);
          this.userSubject.next(res.data.user);
        }
      })
    );
  }

  register(payload: RegisterRequest): Observable<ApiResponse<any>> {
    return this.http.post<ApiResponse<any>>(
      `${environment.apiUrl}/auth/register`, payload
    );
  }

  async logout(): Promise<void> {
    const refreshToken = await this.getRefreshToken();
    if (refreshToken) {
      this.http.post(`${environment.apiUrl}/auth/logout`, { refreshToken }).subscribe();
    }
    await this.persistence.set(this.ACCESS_TOKEN_KEY, null);
    await this.persistence.set(this.REFRESH_TOKEN_KEY, null);
    await this.persistence.set(this.USER_KEY, null);
    this.userSubject.next(null);
  }

  refreshToken(refreshToken: string): Observable<ApiResponse<{ accessToken: string; refreshToken: string }>> {
    return this.http.post<ApiResponse<{ accessToken: string; refreshToken: string }>>(
      `${environment.apiUrl}/auth/refresh`, { refreshToken }
    ).pipe(
      tap(async (res) => {
        if (res.success) {
          await this.persistence.set(this.ACCESS_TOKEN_KEY, res.data.accessToken);
          await this.persistence.set(this.REFRESH_TOKEN_KEY, res.data.refreshToken);
        }
      })
    );
  }
}
