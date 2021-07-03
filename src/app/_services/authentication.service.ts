import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {JwtHelperService} from '@auth0/angular-jwt';
import {ConfigService} from './config.service';
import { CacheMapService } from './cache/cache-map.service';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
 
  httpOptions = {
    headers: new HttpHeaders({'Content-Type': 'application/json'})
  };

  baseurl;
  access_token;
  user;
  access_token_prefix;

  constructor(private http: HttpClient, public jwtHelper: JwtHelperService, private configService: ConfigService, private cacheService: CacheMapService) {
    this.configService.loadConfigurations().subscribe(data => {
      this.baseurl = data.baseurl;
      this.access_token = data.access_token;
      this.user = data.user;
      this.access_token_prefix = data.access_token_prefix;
    })
  }

  login(type: string, email: string, password: string): Observable<any> {
    return this.http.post<any>(`${this.baseurl}login`, {type: type, email: email, password: password}, this.httpOptions)
      .pipe(map(user => {
        if (user && user.access_token) {
          localStorage.setItem(this.access_token, user.access_token);
          localStorage.setItem(this.access_token_prefix, user.access_token_prefix);
         
          localStorage.setItem(this.user, user.user);
        }
        return user;
      }));
  }

  logout() {
    this.cacheService.deleteCache();
    localStorage.removeItem(this.access_token);
    localStorage.removeItem(this.access_token_prefix);
    localStorage.removeItem(this.user);
  }

  public isAuthenticated(): boolean {
    const token = localStorage.getItem(this.access_token);
    return !this.jwtHelper.isTokenExpired(token);
  }

  getOtp(email) {
    //no caching
    return this.http.get<any>(`${this.baseurl}sendOtp?email=${email}`, {
      headers: {
      reset: 'reset'
    }});
  }

  register(userData: {}) {
    return this.http.post(this.baseurl+'admin/registerRequest/', userData, this.httpOptions);
  }

}


