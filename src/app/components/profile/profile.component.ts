import {Component, OnInit} from '@angular/core';
import {RecipientService} from '../../_services/recipient.service';
import {ActivatedRoute, Router} from '@angular/router';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {MatTableDataSource} from '@angular/material';
import {ConfigService} from 'src/app/_services/config.service';
import {CertificateService} from 'src/app/_services/certificate.service';


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
  fields: any [] = [];
  recipientFields: any [] = [];
  recipientFieldsToUpdate;

  //certificateSelection = new SelectionModel<CertificateData>(true, []);

  constructor(private userService: RecipientService, private certificateService: CertificateService, private route: ActivatedRoute, private fb: FormBuilder, private router: Router, private configService: ConfigService) {
    this.configService.loadConfigurations().subscribe(data => {
      this.assets_loc = data.assets_location;
    })
  }

  ngOnInit() {


    this.isUpdated = false;
    this.route.params.subscribe(params => this.id = params.id);
    //console.log(this.id);
    this.user = this.route.snapshot.data.detail;

    this.fields = this.route.snapshot.data.fields;
    this.buildForm();
    this.userService.getCertificates(this.id).subscribe(data => {
      this.certificateDataSource = new MatTableDataSource<CertificateData>(data);
    });
    this.userService.getEmails(this.id).subscribe(data => {
      this.emailDataSource = new MatTableDataSource<EmailData>(data);
    });
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
      let data = {"certificateImage": this.newCertificate};
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
