import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {AdminDetailService} from 'src/app/_services/admin-detail.service';
import {ActivatedRoute} from '@angular/router';
import {ErrorService} from 'src/app/_services/error.service';
import {ConfigService} from 'src/app/_services/config.service';


@Component({
  selector: 'app-admin-profile-edit',
  templateUrl: './admin-profile-edit.component.html',
  styleUrls: ['./admin-profile-edit.component.css']
})
export class AdminProfileEditComponent implements OnInit {
  assets_loc;
  updateForm: FormGroup;
  admin;
  updated: boolean;

  constructor(private fb: FormBuilder, private adminService: AdminDetailService, private route: ActivatedRoute, private errorService: ErrorService, private configService: ConfigService) {
    this.configService.loadConfigurations().subscribe(data => {
      this.assets_loc = data.assets_location;
    })
  }

  ngOnInit() {
    this.updated = false;
    this.admin = this.route.snapshot.data.details;
    this.updateForm = this.fb.group({
      name: [this.admin.name],
      email: [this.admin.email],
      designation: [this.admin.designation],
      phone: [this.admin.phone],
      organization_name: [this.admin.organization_name],
      official_email: [this.admin.official_email],
      website: [this.admin.website],
      city: [this.admin.city]

    });


  }

  update() {
    let data = {
      "name": this.updateForm.get('name').value,
      "designation": this.updateForm.get('designation').value,
      "email": this.updateForm.get('email').value,
      "phone": this.updateForm.get('phone').value,
      "organization_name": this.updateForm.get('organization_name').value,
      "official_email": this.updateForm.get('official_email').value,
      "website": this.updateForm.get('website').value,
      "city": this.updateForm.get('city').value
    }

    this.adminService.updateAdmin(data).subscribe(data => {
      this.errorService.setErrorVisibility(false, "");
      this.updated = true;
    }, error => {
      this.updated = false
    });
  }


}
