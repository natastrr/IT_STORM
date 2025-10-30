import {HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from "@angular/common/http";
import {catchError, finalize, Observable, switchMap, throwError} from "rxjs";
import {Injectable} from "@angular/core";
import {AuthService} from "./auth.service";
import {LoginResponseType} from "../../../types/login-response.type";
import {DefaultResponseType} from "../../../types/default-response.type";
import {Router} from "@angular/router";
import {LoaderService} from "../../shared/services/loader.service";

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(private authService: AuthService,
              private router: Router,
              private loaderService: LoaderService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    this.loaderService.show();
    const tokens: { accessToken: string | null, refreshToken: string | null } = this.authService.getTokens();
    if (tokens && tokens.accessToken) {
      const authRequest: HttpRequest<any> = req.clone({
        headers: req.headers.set('x-auth', tokens.accessToken),
      });
      return next.handle(authRequest)
        .pipe(
          catchError((error: HttpErrorResponse): Observable<HttpEvent<any>> => {
            if (error.status === 401 && !authRequest.url.includes('/login') && !authRequest.url.includes('/refresh')) {
              return this.handle401Error(authRequest, next);
            }
            return throwError((): HttpErrorResponse => error);
          }),
          finalize((): void => this.loaderService.hide()),
        );
    }
    return next.handle(req)
      .pipe(finalize((): void => this.loaderService.hide()));
  }

  handle401Error(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return this.authService.refresh()
      .pipe(
        switchMap((result: LoginResponseType | DefaultResponseType): Observable<HttpEvent<any>> => {
          let error: string = '';
          if ((result as DefaultResponseType).error !== undefined) {
            error = (result as DefaultResponseType).message;
          }
          const refreshResult: LoginResponseType = result as LoginResponseType;
          if (!refreshResult.accessToken || !refreshResult.refreshToken || !refreshResult.userId) {
            error = 'Ошибка авторизации! ';
          }
          if (error) {
            return throwError((): Error => new Error(error));
          }
          this.authService.setTokens(refreshResult.accessToken, refreshResult.refreshToken);
          const authRequest: HttpRequest<any> = req.clone({
            headers: req.headers.set('x-auth', refreshResult.accessToken)
          });
          return next.handle(authRequest);
        }),
        catchError((error: HttpErrorResponse): Observable<never> => {
          this.authService.removeTokens();
          this.router.navigate(['/']).then();
          return throwError((): HttpErrorResponse => error);
        }),
      );
  }

}
