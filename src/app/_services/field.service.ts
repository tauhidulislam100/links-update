import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../environments/environment';
import {Observable} from 'rxjs';
import {ConfigService} from './config.service';
import {Pageable} from '../pagination/pageable';
import {Page} from '../pagination/page';

@Injectable({
  providedIn: 'root'
})
export class FieldService {
  baseurl = environment.baseurl;

  constructor(private http: HttpClient, private configService: ConfigService) {
    this.configService.loadConfigurations().subscribe(data => {
      this.baseurl = data.baseurl;
    })
  }


  getAllFields(): Observable<any> {
    return this.http.get<any>(`${this.baseurl}fields/all`);
  }

  getAllFieldsPage(pageable: Pageable, reset=false): Observable<any> {
    let url = this.baseurl
      + 'fields/all/page?page=' + pageable.pageNumber
      + '&size=' + pageable.pageSize;
      
    return this.http.get<Page<any>>(url, {
      headers: {
      reset: reset ? 'reset' : ''
    }});
  }


  updateField(id, field): Observable<any> {
    return this.http.put<any>(`${this.baseurl}fields/${id}`, {"name": field});
  }

  addField(field): Observable<any> {
    return this.http.post<any>(`${this.baseurl}fields`, {"name": field});
  }

  deleteField(id): Observable<any> {
    return this.http.delete<any>(`${this.baseurl}fields/${id}`);
  }

}
