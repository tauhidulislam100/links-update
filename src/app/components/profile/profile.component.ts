import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatTableDataSource } from '@angular/material';
import { ActivatedRoute, Router } from '@angular/router';
import { forkJoin } from 'rxjs';
import { CertificateService } from 'src/app/_services/certificate.service';
import { ConfigService } from 'src/app/_services/config.service';
import { FieldService } from 'src/app/_services/field.service';
import { SelectedTabService } from 'src/app/_services/selected-tab.service';
import { RecipientService } from '../../_services/recipient.service';






export interface CertificateData {
  createdAt,
  certificateName
}

export interface EmailData {
  subject,
  sentAt,
  from
}

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})


export class ProfileComponent implements OnInit {
  id;
  assets_loc;
  user;
  certificates;
  emails;
  selectedFileName = "";
  updateForm: FormGroup;
  loader = false;
  certificateDisplayedColumns: string[] = ['job Id', 'Name of Certificate', 'createdAt'];
  certificateDataSource;
  newCertificate = null;
  emailDisplayedColumns: string[] = ['job Id', 'subject', 'from', 'sent on'];
  emailDataSource;
  isUpdated: boolean;
  fields: any[] = [];
  recipientFields: any[] = [];
  recipientFieldsToUpdate;
  selectedTab = 0;
  compName = 'profile';

  //certificateSelection = new SelectionModel<CertificateData>(true, []);

  constructor(
    private userService: RecipientService,
    private certificateService: CertificateService,
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private router: Router,
    private configService: ConfigService,
    private selectedTabService: SelectedTabService,
    private fieldService: FieldService,
  ) {
    this.configService.loadConfigurations().subscribe(data => {
      this.assets_loc = data.assets_location;
    })
    this.selectedTab = this.selectedTabService.getTab(this.compName);
  }

  ngOnInit() {
    this.isUpdated = false;
    this.id = this.route.snapshot.paramMap.get('id');

    forkJoin([this.userService.getById(this.id), this.fieldService.getAllFields()]).subscribe(results => {
      this.user = results[0];
      this.fields = results[1];
      this.buildForm();
    });

    this.userService.getCertificates(this.id).subscribe(data => {
      this.certificateDataSource = new MatTableDataSource<CertificateData>(data);
    });
    this.userService.getEmails(this.id).subscribe(data => {
      this.emailDataSource = new MatTableDataSource<EmailData>(data);
    });
  }

  handleTabChange(e) {
    this.selectedTabService.setTab(this.compName, e.index);
  }

  buildForm() {
    this.updateForm = this.fb.group({
      name: [this.user.name],
      email: [this.user.email, [Validators.email]],
      gender: [this.user.gender],
      mobile: [this.user.mobile_number]
    });
    this.fields.forEach(field => {
      var fieldVal = "";
      if (this.user.fields != null) {
        this.recipientFieldsToUpdate = this.user.fields;
        if (this.user.fields[field.name] != null) {
          let formControl: FormControl = new FormControl(this.user.fields[field.name], []);
          this.updateForm.addControl(field.name, formControl);
          this.recipientFields.push({
            "name": field.name,
            "value": this.user.fields[field.name]
          })
        }
      }
    });
  }

  update() {
    this.loader = true;
    this.fields.forEach(field => {

      if (this.recipientFieldsToUpdate != null) {

        if (this.recipientFieldsToUpdate[field.name] != null) {
          this.recipientFieldsToUpdate[field.name] = this.updateForm.controls[field.name].value;
        }
      }
    });
    let data = {
      "name": this.updateForm.get("name").value,
      "email": this.updateForm.get("email").value,
      "gender": this.updateForm.get("gender").value,
      "mobile_number": this.updateForm.get("mobile").value,
      "fields": this.recipientFieldsToUpdate
    }
    this.userService.updateUser(this.id, data).subscribe(data => {
      this.loader = false;
      this.isUpdated = true
    }, error => {
      this.loader = false;
      this.isUpdated = false;
    });
  }

  Cancel() {
    this.router.navigate(['/']);
  }

  handleCertificateUpload(event) {

    const file = event.target.files[0];
    const reader = new FileReader();
    reader.readAsBinaryString(file);
    reader.onload = () => {

      this.newCertificate = {
        "$binary": {
          "base64": btoa(reader.result.toString())
        }
      };

    }
    this.selectedFileName = event.target.files[0].name;
  }

  uploadCertificate() {
    if (this.newCertificate != null) {
      let data = { "certificateImage": this.newCertificate };
      this.certificateService.uploadCertificate(this.id, data).subscribe(data => {
        this.loader = false;
        this.isUpdated = true
      }, error => {
        this.loader = false;
        this.isUpdated = false;
      });

    }
  }

}
