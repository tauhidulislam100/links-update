import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Observable, of} from 'rxjs';
import {filter, map, shareReplay} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ConfigService {
  private readonly CONFIG_URL = 'assets/config.json';
  private configuration$: Observable<any>;

  constructor(private http: HttpClient) {
  }

  public loadConfigurations(): Observable<any> {
    if (!this.configuration$) {
      this.configuration$ = this.http.get<any>(this.CONFIG_URL).pipe(
        map(data => data.filter(
          d => d.origin === window.location.origin)[0]
        ),
        shareReplay(1)
      );
    }



    return this.configuration$;
  }

  public getCnfig() {
    return this.configuration$;
  }


}
