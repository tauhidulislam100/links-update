import {Injectable} from '@angular/core';
import {HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http';
import {Observable} from 'rxjs';
import {ConfigService} from '../_services/config.service';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {
  access_token;
  access_token_prefix;

  constructor(private configService: ConfigService) {
    this.configService.loadConfigurations().subscribe(data => {
      this.access_token = data.access_token;
      this.access_token_prefix = data.access_token_prefix;
    })
  }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    let access_token = localStorage.getItem(this.access_token);
    const publicPaths = ['login', 'registerRequest', 'sendOtp'];
    if (access_token && !publicPaths.some(path => request.url.includes(path))) {
      request = request.clone({
        setHeaders: {
          Authorization: `AdminBearer ${access_token}`
        }
      });
    }
    return next.handle(request);
  }
}
