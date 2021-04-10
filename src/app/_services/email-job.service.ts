import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {ConfigService} from './config.service';
import {Pageable} from '../pagination/pageable';
import {Observable} from 'rxjs';
import {Page} from '../pagination/page';

@Injectable({
  providedIn: 'root'
})
export class EmailJobService {

  baseurl;

  constructor(private http: HttpClient, private configService: ConfigService) {
    this.configService.loadConfigurations().subscribe(data => {
      this.baseurl = data.baseurl;
    })
  }

  getAllJobs() {
    return this.http.get<any>(`${this.baseurl}useremail/jobs`);
  }

  getAllJobsPage(pageable: Pageable): Observable<any> {
    let url = this.baseurl
      + 'email/jobs/unarchived/page?page=' + pageable.pageNumber
      + '&size=' + pageable.pageSize;
    return this.http.get<Page<any>>(url);
  }

  getEmailsByJobId(id) {
    return this.http.get<any>(`${this.baseurl}email/${id}`);
  }

  getEmailTemplates() {

    return this.http.get<any>(`${this.baseurl}template/email/all`);
  }

  getEmailTemplatesPage(pageable: Pageable): Observable<any> {
    let url = this.baseurl
      + 'template/email/all/page?page=' + pageable.pageNumber
      + '&size=' + pageable.pageSize;
    return this.http.get<Page<any>>(url);
  }

  deleteEmailJob(id) {
    return this.http.delete<any>(`${this.baseurl}email/job/${id}`);
  }


}
