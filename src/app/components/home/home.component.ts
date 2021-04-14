import { Component, OnInit } from '@angular/core';
import { ConfigService } from 'src/app/_services/config.service';
import { HomeService } from 'src/app/_services/home.service';
import { slideUpAnimation } from 'src/app/_animations/slideUp';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  animations: [slideUpAnimation],
  host: {'[@slideUpAnimation]': ''},
})
export class HomeComponent implements OnInit {
  assets_loc;
  icons = [];
  home = {};

  constructor(private configService: ConfigService, private homeService: HomeService) {
    this.configService.loadConfigurations().subscribe(data => {
      this.assets_loc = data.assets_location;
    })
  }

  ngOnInit() {
    this.homeService.getHomePageDetails().subscribe(data => {
      this.home = data;
    })
    this.pload(
      this.assets_loc + "assets/view-users.png",
      this.assets_loc + "assets/certificate-home.svg",
      this.assets_loc + "assets/send-mail.svg",
      this.assets_loc + "assets/view-users.png",
      this.assets_loc + "assets/certificate-home.svg",
      this.assets_loc + "assets/send-mail.svg"
    );
  }


  pload(...args: any[]): void {
    for (var i = 0; i < args.length; i++) {
      this.icons[i] = args[i];
    }
  }

}
