import {Injectable} from '@angular/core';
import {Resolve} from '@angular/router';
import {Observable} from 'rxjs';
import {Page} from './pagination/page';
import {EmailService} from './_services/email.service';


@Injectable()
export class EmailTemplatesCreatedByAdmin implements Resolve<Observable<string>> {
  constructor(private emailService: EmailService) {
  }

  page: Page<any> = new Page();

  resolve() {
    return this.emailService.getTemplatesCreatedByAdminPage(this.page.pageable);
  }
}
