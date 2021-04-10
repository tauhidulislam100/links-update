import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {UserDetail} from '../userDetail';
import {ConfigService} from './config.service';
import {environment} from '../../environments/environment';
import {Page} from '../pagination/page';
import {Pageable} from '../pagination/pageable';

@Injectable({
  providedIn: 'root'
})
export class EmailService {
  baseurl = environment.baseurl;
  selectedUsers: UserDetail[] = [];
  emails: string[] = [];
  names: string[] = [];

  constructor(private http: HttpClient, private configService: ConfigService) {
    this.configService.loadConfigurations().subscribe(data => {
      this.baseurl = data.baseurl;
    })
  }

  sendEmail(body): Observable<any> {
    return this.http.post<any>(`${this.baseurl}sendemail`, body, {responseType: 'text' as 'json'});
  }

  setSelectedUsers(users: UserDetail[]) {
    this.selectedUsers = users;
  }

  getSelectedUsers(): UserDetail[] {
    return this.selectedUsers;
  }

  setEmails(emails: string[]) {
    this.emails = emails;
  }

  getEmails(): string[] {
    return this.emails;
  }

  setNames(names: string[]) {
    this.names = names
  }

  getNames(): string[] {
    return this.names;
  }

  emailSummary() {
    return this.http.post<any>(`${this.baseurl}sendemail/emailsummary`, "", {responseType: 'text' as 'json'});
  }

  addTemplate(data): Observable<any> {
    return this.http.post<any>(`${this.baseurl}template/adminEmail/`, data, {responseType: 'text' as 'json'})
  }

  updateTemplate(id, data) {
    return this.http.put<any>(`${this.baseurl}template/email/${id}`, data, {headers: new HttpHeaders({'Content-Type': 'application/json'})});
  }

  updateTemplateCreatedBy(id, data) {
    return this.http.put<any>(`${this.baseurl}template/adminEmail/${id}`, data, {headers: new HttpHeaders({'Content-Type': 'application/json'})});
  }

  getEmailTemplateById(id) {
    return this.http.get<any>(`${this.baseurl}template/email/${id}`);
  }

  getEmailTemplateByIdAndCreatedBy(id) {
    return this.http.get<any>(`${this.baseurl}template/adminEmail/getCreatedBy/${id}`);
  }

  getTemplatesCreatedByAdmin(): Observable<any> {
    return this.http.get<any>(`${this.baseurl}template/adminEmail/all`);
  }

  getTemplatesCreatedByAdminPage(pageable: Pageable): Observable<any> {
    let url = this.baseurl
      + 'template/adminEmail/all/page?page=' + pageable.pageNumber
      + '&size=' + pageable.pageSize;
    return this.http.get<Page<any>>(url);
  }

  deleteEmailTemplate(id) {
    return this.http.delete<any>(`${this.baseurl}template/adminEmail/${id}`);
  }


  getUnsubscribeList(pageable: Pageable): Observable<any>  { 
    let url = this.baseurl
      + 'unsubscribe_list/page?page=' + pageable.pageNumber
      + '&size=' + pageable.pageSize; 
    return this.http.get<Page<any>>(url); 
  }

  removeFromUnsubscribeList(key) { 
    return this.http.delete<any>(`${this.baseurl}unsubscribe_list/${key}`);
  }

}

