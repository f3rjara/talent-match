import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { TokenService } from '../services/auth/token.service';
import { environment } from '@src/environments/environment';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const tokenService = inject(TokenService);
  const token = tokenService.getAccessToken();

  const excludedUrls = [environment.AUTH_API_URL, environment.AUTH_API_REFRESH_URL, environment.AUTH_API_LOGOUT_URL];
  const isExcluded = excludedUrls.some((url) => req.url.includes(url));

  if (token && !isExcluded) {
    const clonedRequest = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`,
      },
    });
    return next(clonedRequest);
  }

  return next(req);
};
