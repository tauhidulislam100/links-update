import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {AdminDetailService} from 'src/app/_services/admin-detail.service';
import {ErrorService} from 'src/app/_services/error.service';
import {ConfigService} from 'src/app/_services/config.service';
import { AdminType } from 'src/app/_types/adminType';


@Component({
  selector: 'app-admin-profile',
  templateUrl: './admin-profile.component.html',
  styleUrls: ['./admin-profile.component.css']
})
export class AdminProfileComponent implements OnInit {
  assets_loc;

  admin: AdminType;

  constructor(private route: ActivatedRoute, private router: Router, private adminService: AdminDetailService, private errorService: ErrorService, private configService: ConfigService) {
    this.configService.loadConfigurations().subscribe(data => {
      this.assets_loc = data.assets_location;
    })
  }

  ngOnInit() {
    this.adminService.getAdminProfileDetail().subscribe(data => {
      this.admin = data;
    })
  }

  edit() {
    this.router.navigate(['/AdminProfile/Edit']);
  }

}
