import {Injectable} from '@angular/core';
import {Resolve} from '@angular/router';
import {Observable} from 'rxjs';
import {AdminDetailService} from './_services/admin-detail.service';

@Injectable()
export class NavBarResolver implements Resolve<Observable<string>> {
  constructor(private adminService: AdminDetailService) {
  }

  resolve() {
    return this.adminService.getLoggedInAdmin();

  }
}
