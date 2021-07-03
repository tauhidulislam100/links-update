import {Injectable} from '@angular/core';
import {HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http';
import {Observable, throwError} from 'rxjs';
import {catchError} from 'rxjs/operators';
import {Router} from '@angular/router';
import {ErrorService} from '../_services/error.service';
import { hasErrorMessage } from 'src/app/utils/hasErrorMessage';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  constructor(public router: Router, public errorService: ErrorService) {
  }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(request).pipe(catchError(err => {
      if (err.status === 403) {
        this.errorService.setErrorVisibility(true, "Unauthorized access forbidden, please login");
        this.router.navigate(['/AdminLogin']);
        return throwError(err);
      } else if (err.status === 404 && hasErrorMessage(err)) {
        this.errorService.setErrorVisibility(true, hasErrorMessage(err));
        return throwError(err);
      } else if (err.status === 401) {
        this.errorService.setErrorVisibility(true, err.error.errors[0]);
        return throwError(err);
      } else if(hasErrorMessage(err)) {
        this.errorService.setErrorVisibility(true, hasErrorMessage(err));
        return throwError(err);
      }
      this.errorService.setErrorVisibility(true, "Something went wrong at server side. ");
      return throwError(err);
    }))
  }

}
