import {Component, OnInit} from '@angular/core';

import {AdminDetailService} from '../../_services/admin-detail.service';
import {NavbarService} from 'src/app/_services/navbar.service';
import {ConfigService} from 'src/app/_services/config.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  userName: String = "";
  userEmail: String = "";
  showDropDown = false;
  showMobileMenu = false;
  assets_loc;
  backgroundimg = 'assets/shape-with-border.svg';
  icons = [];

  constructor(private adminService: AdminDetailService, public nav: NavbarService, private configService: ConfigService) {
    // document.getElementsByClassName('links-header')
    this.configService.loadConfigurations().subscribe(data => {
      this.assets_loc = data.assets_location;

    })
  }

  ngOnInit() {

    this.adminService.getLoggedInAdmin().subscribe(data => {
      this.userName = data.name;
      this.userEmail = data.email;
    });

    this.pload(
      this.assets_loc + "assets/logo-h.png"
    );


  }

  toggleDropDown(e) {
    e.preventDefault();
    this.showDropDown = !this.showDropDown;
  }

  toggleMobileMenu(e) {
    e.preventDefault();
    this.showMobileMenu = !this.showMobileMenu;
  }


  pload(...args: any[]): void {
    for (var i = 0; i < args.length; i++) {
      this.icons[i] = new Image();
      this.icons[i].src = args[i];
      // console.log('loaded: ' + args[i]);
    }
  }

}
