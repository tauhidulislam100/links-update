import {Injectable} from '@angular/core';
import {Resolve} from '@angular/router';
import {Observable} from 'rxjs';
import {CertificateService} from './_services/certificate.service';

@Injectable()
export class GenerateCertificateTemplatesResolver implements Resolve<Observable<string>> {

  constructor(private certificateService: CertificateService) {
  }

  resolve() {
    return this.certificateService.getTemplates();
  }
}
