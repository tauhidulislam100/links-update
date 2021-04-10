import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, Resolve} from '@angular/router';
import {Observable} from 'rxjs';
import {CertificateService} from './_services/certificate.service';


@Injectable()
export class CertificateJobDetailResolver implements Resolve<Observable<string>> {
  constructor(private certificateService: CertificateService) {
  }

  resolve(route: ActivatedRouteSnapshot) {


    return this.certificateService.getJobDetails(route.params.id);

  }
}
