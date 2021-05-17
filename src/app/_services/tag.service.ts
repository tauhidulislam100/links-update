import {Injectable} from '@angular/core';

import {environment} from '../../environments/environment';
import {HttpClient} from '@angular/common/http';
import {ConfigService} from './config.service';
import {Observable} from 'rxjs';
import {Pageable} from '../pagination/pageable';
import {Page} from '../pagination/page';
import {} from './cache/cache-map.service';

@Injectable({
  providedIn: 'root'
})
export class TagService {
  constructor(private http: HttpClient, private configService: ConfigService) {
    this.configService.loadConfigurations().subscribe(data => {
      this.baseurl = data.baseurl;
    })
  }

  filterValue;
  baseurl = environment.baseurl;

  setFilterTag(tag) {
    this.filterValue = tag;
  }

  getFilterTag() {
    return this.filterValue;
  }

  updateTag(id, tag) {

    return this.http.put<any>(`${this.baseurl}tags/${id}`, {"name": tag});
  }

  addTag(tag) {
    return this.http.post<any>(`${this.baseurl}tags`, {"name": tag});
  }

  getAllTagsPage(pageable: Pageable, reset=false): Observable<any> {
    let url = this.baseurl
      + 'tags/all/page?page=' + pageable.pageNumber
      + '&size=' + pageable.pageSize;

    return this.http.get<Page<any>>(url, {
      headers: {
      reset: reset ? 'reset' : ''
    }});
  }

}
