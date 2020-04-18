import { HttpInterceptor, HttpRequest, HttpEvent, HttpHandler } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { Router, NavigationExtras } from '@angular/router';
import { Injectable } from '@angular/core';
import { catchError } from 'rxjs/operators';
import { error } from 'protractor';
import { ToastrService } from 'ngx-toastr';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  constructor(private readonly router: Router, private toastr: ToastrService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(req).pipe(
      catchError((err) => {
        if (err) {
          if (err.status === 400) {
            if (err.error.errors) {
              throw err.error;
            } else {
              this.toastr.error(err.error.message, err.error.statusCode);
            }
          } else if (err.status === 401) {
            this.toastr.error(err.error.message, err.error.statusCode);
          } else if (err.status === 404) {
            this.router.navigateByUrl('/not-found');
          } else if (err.status === 500) {
            const navigationExtras: NavigationExtras = { state: { error: err.error } };
            this.router.navigateByUrl('/server-error', navigationExtras);
          }
        }

        return throwError(err);
      })
    );
  }
}
