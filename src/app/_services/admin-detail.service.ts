import {Injectable} from '@angular/core';
import {Observable, throwError} from 'rxjs';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {ConfigService} from './config.service';
import {Router} from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AdminDetailService {

  baseurl;
  user;

  constructor(private http: HttpClient, private configService: ConfigService, private router: Router) {
    
    this.configService.loadConfigurations().subscribe(data => {
      this.baseurl = data.baseurl;
      this.user = data.user;
    })
  }

  updateAdmin(data): Observable<any> {
  
    let id = localStorage.getItem(this.user);

    return this.http.post<any>(`${this.baseurl}admin/updateRequest/${id}`, data, {headers: new HttpHeaders({'Content-Type': 'application/json'})});
  }

  raiseTicket(data): Observable<any> {
    return this.http.post<any>(`${this.baseurl}admin/raiseTicket`, data, {headers: new HttpHeaders({'Content-Type': 'application/json'})});
  }

  handleError(error) {
    this.router.navigate(['/AdminLogin']);
    return throwError(error);
  }

  getLoggedInAdmin(): Observable<any> {
    return this.http.get<any>(`${this.baseurl}admin/loggedInAdmin`)
  }

   getAdminProfileDetail(): Observable<any> {
    return this.http.get<any>(`${this.baseurl}admin/profile`)
  }
}
