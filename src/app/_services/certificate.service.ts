import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {HttpClient, HttpHeaders,} from '@angular/common/http';
import {UserDetail} from '../userDetail';

import {environment} from '../../environments/environment';
import {ConfigService} from './config.service';
import {Pageable} from '../pagination/pageable';
import {Page} from '../pagination/page';

@Injectable({
  providedIn: 'root'
})
export class CertificateService {
  httpOptions = {
    headers: new HttpHeaders({'Content-Type': 'application/json'})
  };
  selectedUsers: UserDetail[] = [];
  selectedIds: number[] = [];
  baseurl = environment.baseurl;

  constructor(private http: HttpClient, private configService: ConfigService) {
    this.configService.loadConfigurations().subscribe(data => {
      this.baseurl = data.baseurl;
    })
  }

  getTemplates(): Observable<any> {
    return this.http.get<any>(`${this.baseurl}template/certificate/all`);
  }

  getCertificateTemplatesPage(pageable: Pageable): Observable<any> {
    let url = this.baseurl
      + 'template/certificate/all/page?page=' + pageable.pageNumber
      + '&size=' + pageable.pageSize;
    return this.http.get<Page<any>>(url, this.httpOptions);
  }

  generateFromCSV(data, type: string): Observable<any> {
    return this.http.post<any>(`${this.baseurl}certificate/generate/fromcsv?type=${type}`, data, this.httpOptions);
  }

  generateCertificates(data, id): Observable<any> {
    return this.http.post<any>(`${this.baseurl}certificate/generate?id=${id}`, data, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Connection': 'keep-alive'
      }), responseType: 'text' as 'json'
    });
  }

  getAllJobs(): Observable<any> {
    return this.http.get<any>(`${this.baseurl}certificate/jobs`);
  }

  public getAllJobsPage(pageable: Pageable): Observable<any> {
    let url = this.baseurl
      + 'certificate/jobs/unarchived/page?page=' + pageable.pageNumber
      + '&size=' + pageable.pageSize;
    return this.http.get<Page<any>>(url, this.httpOptions);
  }


  setSelectedUsers(users: UserDetail[]) {
    this.selectedUsers = users;
  }

  getSelectedUsers(): UserDetail[] {
    return this.selectedUsers;
  }

  setSelectedIds(selectedIds: number[]) {
    this.selectedIds = selectedIds;
  }

  getSelectedIds(): number[] {
    return this.selectedIds
  }

  downloadCertificate(jobId) {
    return this.http.get(`${this.baseurl}certificate/download/${jobId}`, {
      headers: new HttpHeaders({}),
      responseType: 'blob'
    });
  }

  releaseCertificate(id, data): Observable<any> {
    return this.http.post<any>(`${this.baseurl}certificate/release?jobId=${id}`, data, {responseType: 'text' as 'json'});
  }

  generatedSummary() {
    return this.http.post<any>(`${this.baseurl}sendemail/certificategeneratesummary?action=generated`, "", {responseType: 'text' as 'json'});
  }

  releaseSummary(JobId) {
    return this.http.post<any>(`${this.baseurl}sendemail/certificatesummary/${JobId}?action=released`, "");
  }

  getJobDetails(jobId) {
    return this.http.get<any>(`${this.baseurl}certificate/detail/${jobId}`);
  }

  publishCertificate(jobId, data) {
    return this.http.post<any>(`${this.baseurl}certificate/publish/${jobId}`, data);
  }

  getTemplateById(id) {
    return this.http.get<any>(`${this.baseurl}template/certificate/${id}`);

  }

  updateCertificateTemplate(id, data) {
    return this.http.put<any>(`${this.baseurl}template/certificate/${id}`, data, {headers: new HttpHeaders({'Content-Type': 'application/json'})});
  }

  deleteCertificateTemplate(id) {
    return this.http.delete<any>(`${this.baseurl}template/certificate/${id}`);
  }

  updateTheme(templateId, fontThemeId): Observable<any> {
    return this.http.put(`${this.baseurl}template/certificate/updateTheme/${templateId}?themeId=${fontThemeId}`, {headers: new HttpHeaders({'Content-Type': 'application/json'})});
  }

  uploadCertificate(id, data): Observable<any> {
    return this.http.post<any>(`${this.baseurl}certificate/uploadCertificate/${id}`, data, {responseType: 'text' as 'json'});
  }

  validateCertificatesOnServer(id) {
    return this.http.post<any>(`${this.baseurl}certificate/validateCertificatesOnServer/${id}`, "", {responseType: 'text' as 'json'});
  }

  regenerateCertificate(id, data) {
    return this.http.post<any>(`${this.baseurl}certificate/regenerate/${id}`, data, {responseType: 'text' as 'json'});
  }

  deleteCertificateJob(id) { 
    return this.http.delete<any>(`${this.baseurl}certificate/jobs/${id}`);
  }

}
