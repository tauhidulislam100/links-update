import { Component, HostListener, OnInit, ViewChild } from '@angular/core';

import { AdminDetailService } from '../../_services/admin-detail.service';
import { AuthenticationService } from '../../_services/authentication.service';
import { NavbarService } from 'src/app/_services/navbar.service';
import { ConfigService } from 'src/app/_services/config.service';
import { preload } from 'src/app/utils/preload';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  @ViewChild('dropDownContainer', {static: true}) dropDownContainer;
  userName: string = "";
  userEmail: string = "";
  showDropDown = false;
  showMobileMenu = false;
  assets_loc;
  backgroundimg = 'assets/shape-with-border.svg';
  icons = [];

  constructor(private adminService: AdminDetailService, public nav: NavbarService, private configService: ConfigService, private router: Router, private authService: AuthenticationService) {
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

    this.icons = preload(
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

  @HostListener('document:click', ['$event.target'])
  clickedOutSide(targetElement) {
    const clickedInside = this.dropDownContainer.nativeElement.contains(targetElement);
    if (!clickedInside) {
      this.showDropDown = false;
    }
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/AdminLogin']);
  }
}
