import {Component} from '@angular/core';
import {NavbarService} from './_services/navbar.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  constructor(private nav: NavbarService) {
  }

  title = 'links-web';
}
