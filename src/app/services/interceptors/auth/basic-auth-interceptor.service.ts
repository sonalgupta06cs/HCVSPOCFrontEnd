import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpHandler, HttpRequest, HttpErrorResponse } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { LoginService } from '../../login/login.service';

@Injectable({
  providedIn: 'root'
})
export class BasicAuthHttpInterceptorService implements HttpInterceptor {

  constructor(private loginService: LoginService) { }

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
    ) {

    if ((this.loginService.currentUserName && this.loginService.tokenStr) &&
            (sessionStorage.getItem('username') && sessionStorage.getItem('token'))) {

      // console.log('loginservice currentUserName ' + this.loginService.currentUserName + ' ' + this.loginService.authString);

      req = req.clone({
        setHeaders: {
          Authorization: sessionStorage.getItem('token')
        }
      })
    }

    return next.handle(req);
  }
}
