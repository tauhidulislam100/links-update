import {Injectable} from '@angular/core';
import {ActivatedRoute, ActivatedRouteSnapshot, Resolve} from '@angular/router';
import {Observable} from 'rxjs';
import {CertificateService} from './_services/certificate.service';


@Injectable()
export class UpdateCertificateTemplateResolver implements Resolve<Observable<string>> {
  constructor(private certificateService: CertificateService, private route: ActivatedRoute) {
  }

  resolve(route: ActivatedRouteSnapshot) {
    return this.certificateService.getTemplateById(route.params.id);
  }
}
