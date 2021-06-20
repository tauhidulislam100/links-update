import { Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
import { AdminDetailService } from '../../_services/admin-detail.service'
import { ActivatedRoute, Router } from '@angular/router';
import { CertificateService } from '../../_services/certificate.service';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { UserDetail } from 'src/app/_models/userDetail';
import { validateUserDetail } from '../../_custome-validators/certificateForm.validator';
import { SelectionModel } from '@angular/cdk/collections';
import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { formatDate } from '@angular/common';
import { ErrorService } from 'src/app/_services/error.service';
import { ConfigService } from 'src/app/_services/config.service';
import { MatDialog } from "@angular/material/dialog";
import { ConfirmationDialogueComponent } from "../confirmation-dialogue/confirmation-dialogue.component";

export interface JobData {
  id,
  created_at
}

@Component({
  selector: 'app-certificate',
  templateUrl: './certificate.component.html',
  styleUrls: ['./certificate.component.css']
})
export class CertificateComponent implements OnInit {
  assets_loc;
  Editor = ClassicEditor;
  admin;
  template: any[] = [];
  userData: UserDetail[] = [];
  allJobs;
  selectedIds;
  loader = false;
  certificateDetail: FormGroup;
  certificateDetail1: FormGroup;
  popoverTitle = "Submit Job";
  popoverMessage = "";
  confirmClicked = false;
  cancelClicked = false;
  emailForm: FormGroup;
  jobsForm: FormGroup;
  displayedColumns: string[];
  dataSource;
  selection = new SelectionModel<JobData>(true, []);
  usersSelected = false;
  jobSubmitted: boolean;
  requiredFields: any[] = [];
  allUserData;
  noOfRecipientsMoreThen1000: boolean;
  submitedJobId;
  @ViewChild('message', { static: false }) message: ElementRef;

  constructor(
    private route: ActivatedRoute,
    private adminDetailService: AdminDetailService,
    private certificateService: CertificateService,
    private fb: FormBuilder,
    private router: Router,
    private errorService: ErrorService,
    private renderer: Renderer2,
    private configService: ConfigService,
    private dialog: MatDialog
  ) {
    this.configService.loadConfigurations().subscribe(data => {
      this.assets_loc = data.assets_location;
    })
  }

  get templateSelect() {
    return this.certificateDetail1.controls.templateSelect;
  }

  get userDetails() {
    return this.certificateDetail1.controls.userDetails;
  }

  ngOnInit() {
    this.jobSubmitted = false;
    this.certificateService.getTemplates().subscribe(template => {
      this.template = template;
      let id = (this.template[0].id).toString();
      this.onChange(id);
      this.userData = this.certificateService.getSelectedUsers();
      this.popoverMessage = "Please confirm the submission of job for " + this.userData.length.toString() + " Recipient.";
      this.setUserDetails();
      this.selectedIds = this.certificateService.getSelectedIds();
      if (this.selectedIds.length > 0) {
        this.usersSelected = true;
      }
    })

  }

  getCertificateTemplates(): void {
    this.template = this.route.snapshot.data.templates;
  }


  buildCertificateForm1(fields: any[], templateId, userData) {


    this.certificateDetail1 = this.fb.group({
      templateSelect: [templateId, []],
      userDetails: [userData, [Validators.required, validateUserDetail(templateId)]]
    }
    );
    fields.forEach(field => {
      let control: FormControl = new FormControl('', [Validators.required]);
      this.certificateDetail1.addControl(field.value, control);
    });
  }

  onChange(event) {
    let userData = this.setUserDetails();
    let template = this.getSelectedTemplateDetails(event);
    this.requiredFields = template.instructions.required_fields;
    this.buildCertificateForm1(this.requiredFields, event, userData);
  }

  getSelectedTemplateDetails(templateId) {
    let template;
    this.template.forEach(data => {

      if (data.id == templateId) {
        template = data;
      }
    });
    return template;
  }

  get usersList(): UserDetail[] {
    let users: UserDetail[] = [];
    let detail: string = this.userDetails.value;
    let detailList: string[] = detail.split("\n");
    detailList.map(
      data => {
        let user: string[] = data.split(",");
        if (user.length == 2) {
          let user1 = new UserDetail("", user[0], user[1], "");
          users.push(user1);
        }
      });
    return users;
  }

  submitJob() {
    if (this.userData.length > 50) {
      const dialogRef = this.dialog.open(ConfirmationDialogueComponent, {
        width: '400px',
        data: { title: "Please confirm the submission of job for " + this.userData.length.toString() + "  recipient." }
      });
      dialogRef.afterClosed().subscribe(result => {
        if (result.event == 'Submit') {
          this.generateByIds1(result.data);
        }
      });
    } else {
      this.generateByIds1("Generating certificates for " + this.userData.length.toString() + " recipient");
    }

  }

  generateByIds1(comment) {

    this.loader = true;
    let users = this.selectedIds;
    let id = this.templateSelect.value;
    let details = {};

    this.requiredFields.forEach(field => {
      if (field.type == "date") {
        details[field.value] = formatDate(this.certificateDetail1.controls[field.value].value, 'MM/dd/yyyy', 'en-US');
      } else {
        details[field.value] = this.certificateDetail1.get(field.value).value
      }

    });
    let body = {
      "users": users,
      "details": details,
      "comment": comment
    }

    this.certificateService.generateCertificates(body, id).subscribe(data => {
      this.submitedJobId = data;
      this.loader = false;
      this.jobSubmitted = true;
      let div = this.renderer.createElement('div');
      div.innerHTML = "<div class=\"alert alert-success\" role=\"alert\">" +
        "Done! Task# of this request is " + this.submitedJobId +
        "</div>"
      this.renderer.appendChild(this.message.nativeElement, div);
      this.errorService.setErrorVisibility(false, "");

    }, error => {
      this.loader = false
    }
    );

  }

  setUserDetails() {
    let details: string = "";
    this.certificateService.getSelectedUsers().forEach(data => {
      details += data.email + "," + data.name + "," + data.gender + "\n";
    });
    return details;
  }
}

