import {Injectable} from "@angular/core";
import {Resolve} from '@angular/router';
import {Observable} from 'rxjs';
import {RecipientService} from './_services/recipient.service';


@Injectable()
export class RecipientsResolver implements Resolve<Observable<string>> {
  constructor(private userService: RecipientService) {
  }

  resolve() {


    return this.userService.getAllNewUsers();

  }
}
