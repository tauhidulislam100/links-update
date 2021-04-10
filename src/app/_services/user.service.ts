import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {environment} from '../../environments/environment';


@Injectable({
  providedIn: 'root'
})
export class UserService {
  httpOptions = {
    headers: new HttpHeaders(),
    responseType: 'text' as 'text'
  };
  baseurl = environment.baseurl;

  constructor(private http: HttpClient) {
  }

  getUsersAfterSaving(): any {
    return this.http.get(`${this.baseurl}user/all`).toPromise();
  }

  getAllUsers(): Observable<any> {
    return this.http.get<any>(`${this.baseurl}user/all`);
  }

  addTags(userId: any[], tag): Observable<string> {
    return this.http.post<string>(`${this.baseurl}user/tags?tag_name=${tag}`, userId, {responseType: 'text' as 'json'});
  }

  addTag(id, tag): Observable<string> {
    return this.http.post<string>(`${this.baseurl}user/${id}/tags?tag_name=${tag}`, "", {responseType: 'text' as 'json'});
  }

  removeTags(id, tagId): Observable<string> {
    return this.http.delete<string>(`${this.baseurl}user/${id}/tags?tag_id=${tagId}`, {responseType: 'text' as 'json'});
  }

  saveUsers(user): Observable<any> {
    return this.http.post<any>(`${this.baseurl}user`, user);
  }

  getById(id): Observable<any> {
    return this.http.get<any>(`${this.baseurl}user/${id}`);
  }

  getAllTags(): Observable<any> {
    return this.http.get<any>(`${this.baseurl}tags/all`);
  }

  getCertificates(id): Observable<any> {
    return this.http.get<any>(`${this.baseurl}user/certificates/${id}`);
  }

  getEmails(id): Observable<any> {
    return this.http.get<any>(`${this.baseurl}user/emails/${id}`);
  }

  updateUser(id, data): Observable<any> {
    return this.http.put<any>(`${this.baseurl}user/${id}`, data, {headers: new HttpHeaders({'Content-Type': 'application/json'})});
  }

  getByTag(id): Observable<any> {
    return this.http.get<any>(`${this.baseurl}tags/${id}/users`);
  }

  getByEmails(emails): any {
    return this.http.post<any>(`${this.baseurl}user/allByEmail`, emails).toPromise();
  }

  getAllNewUsers(): any {
    return this.http.get<any>(`${this.baseurl}user/getNewUsers`)
  }

}
