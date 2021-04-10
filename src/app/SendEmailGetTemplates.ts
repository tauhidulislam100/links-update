import {Injectable} from '@angular/core';
import {Resolve} from '@angular/router';
import {Observable} from 'rxjs';
import {EmailService} from './_services/email.service';


@Injectable()
export class SendEmailGetTemplatesCreatedByAdmin implements Resolve<Observable<string>> {
  constructor(private emailService: EmailService) {
  }

  resolve() {
    return this.emailService.getTemplatesCreatedByAdmin();
  }
}
