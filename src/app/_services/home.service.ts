import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {environment} from 'src/environments/environment';
import {ConfigService} from './config.service';

@Injectable({
  providedIn: 'root'
})
export class HomeService {
  baseurl = environment.baseurl;

  constructor(private http: HttpClient, private configService: ConfigService) {
    this.configService.loadConfigurations().subscribe(data => {
      this.baseurl = data.baseurl;
    })
  }


  getHomePageDetails() {
    return this.http.get<any>(`${this.baseurl}home`);
  }
}
