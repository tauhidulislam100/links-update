import {Injectable} from '@angular/core';
import {Resolve} from '@angular/router';
import {Observable} from 'rxjs';
import {Page} from './pagination/page';
import {FieldService} from './_services/field.service';


@Injectable()
export class FieldResolver implements Resolve<Observable<string>> {
  constructor(private fieldService: FieldService) {
  }

  page: Page<any> = new Page<any>();

  resolve() {
    return this.fieldService.getAllFieldsPage(this.page.pageable);
  }
}
