import {Injectable} from '@angular/core';
import {ActivatedRoute, ActivatedRouteSnapshot, Resolve} from '@angular/router';
import {Observable} from 'rxjs';
import {EmailJobService} from './_services/email-job.service';


@Injectable()
export class EmailJobDetailResolver implements Resolve<Observable<string>> {
  constructor(private emailJobService: EmailJobService, private route: ActivatedRoute) {
  }

  resolve(route: ActivatedRouteSnapshot) {
    return this.emailJobService.getEmailsByJobId(route.params.id);
  }

}
