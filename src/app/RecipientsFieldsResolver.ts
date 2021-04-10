import {Injectable} from '@angular/core';
import {Resolve} from '@angular/router';
import {Observable} from 'rxjs';
import {FieldService} from './_services/field.service';


@Injectable()
export class RecipientFieldsResolver implements Resolve<Observable<string>> {
  constructor(private fieldService: FieldService) {
  }

  resolve() {
    return this.fieldService.getAllFields();
  }
}
