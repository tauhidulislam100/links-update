import {Injectable} from '@angular/core';
import {Resolve} from '@angular/router';
import {Observable} from 'rxjs';
import {Page} from './pagination/page';
import {CertificateService} from './_services/certificate.service';


@Injectable()
export class CertificateResolver implements Resolve<Observable<string>> {
  page: Page<any> = new Page();

  constructor(private certificateService: CertificateService) {

  }

  resolve() {
    return this.certificateService.getAllJobsPage(this.page.pageable);
  }
}
