import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable, throwError, from, switchMap, catchError } from 'rxjs';
import { AuthService } from '../services/auth.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private authService: AuthService) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return from(this.authService.getAccessToken()).pipe(
      switchMap((token) => {
        if (token && !request.headers.has('Authorization')) {
          request = request.clone({
            setHeaders: { Authorization: `Bearer ${token}` }
          });
        }

        return next.handle(request).pipe(
          catchError((error: HttpErrorResponse) => {
            if (error.status === 401) {
              return from(this.authService.getRefreshToken()).pipe(
                switchMap((refreshToken) => {
                  if (!refreshToken) {
                    this.authService.logout();
                    return throwError(() => error);
                  }
                  return this.authService.refreshToken(refreshToken).pipe(
                    switchMap((res) => {
                      const retried = request.clone({
                        setHeaders: { Authorization: `Bearer ${res.data.accessToken}` }
                      });
                      return next.handle(retried);
                    }),
                    catchError((refreshError) => {
                      this.authService.logout();
                      return throwError(() => refreshError);
                    })
                  );
                })
              );
            }
            return throwError(() => error);
          })
        );
      })
    );
  }
}
