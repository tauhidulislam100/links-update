import {Injectable} from '@angular/core';
import {ActivatedRoute, ActivatedRouteSnapshot, Resolve} from '@angular/router';
import {Observable} from 'rxjs';
import {AdminDetailService} from './_services/admin-detail.service';


@Injectable()
export class AdminProfileResolver implements Resolve<Observable<string>> {
  constructor(private adminService: AdminDetailService, private route: ActivatedRoute) {
  }

  resolve(route: ActivatedRouteSnapshot) {


    return this.adminService.getAdminProfileDetail();

  }
}
