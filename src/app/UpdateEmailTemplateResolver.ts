import {Injectable} from '@angular/core';
import {ActivatedRoute, ActivatedRouteSnapshot, Resolve} from '@angular/router';
import {Observable} from 'rxjs';
import {EmailService} from './_services/email.service';


@Injectable()
export class UpdateEmailTemplateResolver implements Resolve<Observable<string>> {
  constructor(private emailService: EmailService, private route: ActivatedRoute) {
  }

  resolve(route: ActivatedRouteSnapshot) {
    return this.emailService.getEmailTemplateById(route.params.id);
  }
}
