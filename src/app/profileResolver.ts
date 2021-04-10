import {Injectable} from '@angular/core';
import {ActivatedRoute, ActivatedRouteSnapshot, Resolve} from '@angular/router';
import {Observable} from 'rxjs';
import {RecipientService} from './_services/recipient.service';


@Injectable()
export class ProfileResolver implements Resolve<Observable<string>> {
  constructor(private userService: RecipientService, private route: ActivatedRoute) {
  }

  resolve(route: ActivatedRouteSnapshot) {


    return this.userService.getById(route.params.id);

  }
}
