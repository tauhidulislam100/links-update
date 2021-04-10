import {Injectable} from '@angular/core';
import {ActivatedRoute, ActivatedRouteSnapshot, Resolve} from '@angular/router';
import {Observable} from 'rxjs';
import {RecipientService} from './_services/recipient.service';
import {TagService} from './_services/tag.service';


@Injectable()
export class Resolver implements Resolve<Observable<string>> {
  constructor(private userService: RecipientService, private tagService: TagService, private route: ActivatedRoute) {
  }

  resolve(route: ActivatedRouteSnapshot) {
    return this.userService.getByTag(route.params.id);
  }
}
