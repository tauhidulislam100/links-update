import {Injectable} from '@angular/core';
import {HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http';
import {Observable, throwError} from 'rxjs';
import {catchError} from 'rxjs/operators';

import {AuthenticationService} from '../_services/authentication.service';
import {Router} from '@angular/router';
import {ErrorService} from '../_services/error.service';
import { hasErrorMessage } from 'src/app/utils/hasErrorMessage';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  constructor(private authenticationService: AuthenticationService, public router: Router, public errorService: ErrorService) {
  }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(request).pipe(catchError(err => {
      console.log("err ", err);
      if (err.status === 403) {
        // this.router.navigate(['/login']);
        this.errorService.setErrorVisibility(true, "Unautorized access forbiden, please login");
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
