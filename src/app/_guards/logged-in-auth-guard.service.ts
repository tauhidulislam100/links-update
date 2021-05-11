import {Injectable} from '@angular/core';
import {Router, RouterStateSnapshot} from '@angular/router';
import {AuthenticationService} from '../_services/authentication.service';
import {ConfigService} from '../_services/config.service';

@Injectable({
  providedIn: 'root'
})
export class LoggedInAuthGuard {
  access_token;

  constructor(public auth: AuthenticationService, public router: Router, private configService: ConfigService) {
    this.configService.loadConfigurations().subscribe(data => {

      this.access_token = data.access_token;

    })
  }

  canActivate(state: RouterStateSnapshot): boolean {
    if (!localStorage.getItem(this.access_token)) {
      return true;
    } else {
      this.router.navigate(['/']);
      return false;
    }
  }
}
