import {Component, OnInit} from '@angular/core';
import {NavbarService} from 'src/app/_services/navbar.service';
import {ActivatedRoute} from '@angular/router';
import {ConfigService} from 'src/app/_services/config.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  assets_loc;
  icons = [];
  home;

  constructor(private nav: NavbarService, private route: ActivatedRoute, private configService: ConfigService) {
    this.configService.loadConfigurations().subscribe(data => {
      this.assets_loc = data.assets_location;
    })
  }

  ngOnInit() {
    this.nav.show();

    this.pload(
      this.assets_loc + "assets/view-users.png",
      this.assets_loc + "assets/certificate-home.svg",
      this.assets_loc + "assets/send-mail.svg",
      this.assets_loc + "assets/view-users.png",
      this.assets_loc + "assets/certificate-home.svg",
      this.assets_loc + "assets/send-mail.svg"
    );
    this.home = this.route.snapshot.data.summary;
    document.getElementById("total-recipients").appendChild(this.icons[0]);
    document.getElementById("total-certificates").appendChild(this.icons[1]);
    document.getElementById("total-emails").appendChild(this.icons[2]);
    document.getElementById("total-recipients-this-month").appendChild(this.icons[3]);
    document.getElementById("total-certificates-this-month").appendChild(this.icons[4]);
    document.getElementById("total-emails-this-month").appendChild(this.icons[5]);
  }


  pload(...args: any[]): void {
    for (var i = 0; i < args.length; i++) {
      this.icons[i] = new Image();
      this.icons[i].src = args[i];
    }
  }

}
