import { Component, OnInit, OnDestroy } from '@angular/core';
import { ConfigService } from 'src/app/_services/config.service';
import { HomeService } from 'src/app/_services/home.service';
import { slideUpAnimation } from 'src/app/_animations/slideUp';
import { preload } from 'src/app/utils/preload';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  animations: [slideUpAnimation],
  host: {'[@slideUpAnimation]': ''},
})
export class HomeComponent implements OnInit, OnDestroy {
  assets_loc;
  icons:string[] = [];
  home = {
    changeInCertificatesReleasedThisMonth: 0,
    changeInEmailSentThisMonth: 0,
    changeInRecipientsAddedThisMonth: 0,
    totalCertificatesReleased: 0,
    totalCertificatesReleasedThisMonth: 0,
    totalEmailsSent: 0,
    totalEmailsSentThisMonth: 0,
    totalNoOfRecipients: 0,
    totalRecipientsAddedThisMonth: 0,
  };
  subscription: Subscription = null;

  constructor(private configService: ConfigService, private homeService: HomeService) {
    this.configService.loadConfigurations().subscribe(data => {
      this.assets_loc = data.assets_location;
    })
  }

  ngOnInit() {
    this.subscription = this.homeService.getHomePageDetails().subscribe(data => {
      this.home = data;
    })

    this.icons = preload(
      this.assets_loc + "assets/view-users.png",
      this.assets_loc + "assets/certificate-home.svg",
      this.assets_loc + "assets/send-mail.svg",
      this.assets_loc + "assets/view-users.png",
      this.assets_loc + "assets/certificate-home.svg",
      this.assets_loc + "assets/send-mail.svg"
    );
  }

  ngOnDestroy() {
    this.subscription && this.subscription.unsubscribe();
  }

}
