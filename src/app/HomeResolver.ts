import {Injectable} from "@angular/core";
import {Resolve} from '@angular/router';
import {Observable} from 'rxjs';
import {HomeService} from './_services/home.service';


@Injectable()
export class HomeResolver implements Resolve<Observable<string>> {
  constructor(private homeService: HomeService) {
  }

  resolve() {
    return this.homeService.getHomePageDetails();

  }
}

