import {AfterViewInit, Component, ElementRef, OnInit, Renderer2, ViewChild} from '@angular/core';
import {AdminDetailService} from '../../_services/admin-detail.service'
import {ActivatedRoute} from '@angular/router';
import {CertificateService} from '../../_services/certificate.service';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {SelectionModel} from '@angular/cdk/collections';
import {EmailService} from '../../_services/email.service';
import {ErrorService} from 'src/app/_services/error.service';
import {validateField} from 'src/app/_custome-validators/certificateForm.validator';
import {ConfigService} from 'src/app/_services/config.service';
import {ThemePalette} from "@angular/material/core";
import {ConfirmationDialogueComponent} from "../confirmation-dialogue/confirmation-dialogue.component";
import {MatDialog} from "@angular/material/dialog";

export interface JobData {
  id,
  created_at
}

@Component({
  selector: 'app-email',
  templateUrl: './email.component.html',
  styleUrls: ['./email.component.css']
})

export class EmailComponent implements OnInit, AfterViewInit {
  assets_loc;
  admin;
  template;
  userData;
  allJobs;
  listOfRecipients: any[] = [];
  loader = false;
  certificateDetail: FormGroup;
  emailForm: FormGroup;
  jobsForm: FormGroup;
  displayedColumns: string[];
  dataSource;
  recipientIds: any[] = [];
  selection = new SelectionModel<JobData>(true, []);
  usersSelected = false;
  emailSent: boolean;
  fields: any [] = [];
  emailTemplates: any[] = [];
  noOfRecipientsMoreThen1000: boolean;
  popoverMessage = "";
  popoverTitle = "Submit Job";
  color: ThemePalette = 'accent';
  checked = false;
  disabled = false;
  recipientSizeIsZero = false;
  submittedJobId;
  emailLimitIsReached = false;
  @ViewChild('emailSubject', {static: false}) emailSubject: ElementRef;
  @ViewChild('emailBody', {static: true}) emailBody: ElementRef;
  @ViewChild('message', {static: false}) message: ElementRef;

  constructor(private route: ActivatedRoute,
              private adminDetailService: AdminDetailService,
              private certificateService: CertificateService,
              private fb: FormBuilder,
              private emailService: EmailService,
              private errorService: ErrorService,
              private configService: ConfigService,
              private renderer:Renderer2
    , private dialog: MatDialog) {
    this.configService.loadConfigurations().subscribe(data => {
      this.assets_loc = data.assets_location;
    })
  }

  ngAfterViewInit() {
    this.emailSubject.nativeElement.focus();
  }

  ngOnInit() {
    this.emailSent = false;
    this.fields = this.route.snapshot.data.fields;

    this.emailTemplates = this.route.snapshot.data.templates;
    this.emailForm = this.fb.group({
      subject: ['', Validators.required],
      listOfRecepients: ['', Validators.required],
      body: ['', Validators.required],
      templateSelect: ['0']
    });

    this.setUserDetails();
    this.listOfRecipients = this.emailService.getSelectedUsers();
    this.popoverMessage = "Please confirm the submission of job for " + this.listOfRecipients.length.toString() + " Recipient.";

    if (this.listOfRecipients.length > 0) {
      this.usersSelected = true;
    }

  

  }

  onChange(id) {
    if (id == 0) {
      this.emailForm.controls['subject'].setValue("");
      this.emailForm.controls['body'].setValue("");

    } else {
      let template = this.emailTemplates.find(data => data.id == id);
      this.checked = template.unsubscribeOptionEnabled;
      this.emailForm.controls['subject'].setValue(template.subject);
      this.emailForm.controls['body'].setValue(template.body);
    }

  }


  getListOfRecepients(recepients: string) {
    let list: any[] = [];
    let users = recepients.split("\n");
    users.forEach(data => {
      let data1 = {
        "recepientEmail": data,
        "keywords": {}
      }
      list.push(data1);
    });
    return list;
  }

  sendEmail(comment) {
    let com = comment;
    this.emailForm.get('body').setValidators([Validators.required, validateField(this.fields)]);
    this.emailForm.get('body').updateValueAndValidity();

    // if (this.emailForm.get('body').valid) {
      this.loader = true;
      let sub = this.emailForm.get('subject').value;
      let recepientsArray: any[] = [];
      this.listOfRecipients.forEach(data => {
        let recipient = {}
        recepientsArray.push(recipient);
      })
      let body = this.emailForm.get('body').value;
      let templateId = this.emailForm.get('templateSelect').value;
      let requestBody = {
        "comment": com,
        "subject": sub,
        "body": body,
        "recipients": this.recipientIds,
        "unsubscribeOptionEnabled": this.checked,
        "emailTemplateId": templateId


      };
      this.emailService.sendEmail(requestBody).subscribe(data => {
          this.loader = false;
          let data1 = JSON.parse(data);
          if (data1.limitIsReached) {
            this.emailLimitIsReached = true;
            this.recipientSizeIsZero = false;
            let div = this.renderer.createElement('div');
            div.innerHTML = "<div class=\"alert alert-danger\" role=\"alert\">" +
              "Oh! It seems there is not enough limit to send emails. You can check the balance at the <a\n" +
              "        [routerLink]=\"'/AdminProfile'\" routerLinkActive=\"active\">profile's page</a>  and raise a ticket for limit increase at  <a\n" +
              "        [routerLink]=\"'/FAQ'\" routerLinkActive=\"active\">Support page</a> " +
              "</div>"
            this.renderer.appendChild(this.message.nativeElement,div);

            this.emailSent = false;
          } else {
            this.emailLimitIsReached = false;
            if (data1.noOfRecipients == 0) {
              this.recipientSizeIsZero = true;
              this.emailSent = false;
              let div = this.renderer.createElement('div');
              div.innerHTML = "<div class=\"alert alert-danger\" role=\"alert\">" +
                "Requested email addresses are invalid or unsubscribed for the email." +
                "</div>"
              this.renderer.appendChild(this.message.nativeElement,div);

            } else {
              this.recipientSizeIsZero = false;
              this.submittedJobId = data1.emailJob;
              let div = this.renderer.createElement('div');
              if(data1.noOfRecipients == 1){
              div.innerHTML = "<div class=\"alert alert-success\" role=\"alert\">" +
                "Great! The email is on its way." +
                "</div>"
              }else {
                div.innerHTML = "<div class=\"alert alert-success\" role=\"alert\">" +
                  "Great! Emails are on their way to "+data1.noOfRecipients+" recipients." +
                  "</div>"
              }
              this.renderer.appendChild(this.message.nativeElement,div);
              // this.popoverTitle = data;
              this.emailSent = true;
              this.errorService.setErrorVisibility(false, "");
            }
          }
        },
        error => {
          this.emailSent = false;
          this.loader = false
        });
    // }
  }


  setUserDetails() {
    let details: string = "";
    this.emailService.getSelectedUsers().forEach(data => {
      this.recipientIds.push(data.id);
      details += data.email + "," + data.name + "\n";
    });
    this.emailForm.get("listOfRecepients").setValue(details);
  }

  unsubscribeToggle() {
    if (this.checked == false) {
      this.checked = true;
      this.addUnsubscribeLink();
    } else {
      this.checked = false;
      this.removeUnsubscribeLink()
    }

  }

  addUnsubscribeLink() {
    let body = this.emailForm.get('body').value;
    let container = document.createElement("main");
    container.innerHTML = body;

    let footer = document.createElement("footer");

    footer.innerHTML = " <div style=\"border-top: 1px solid black;bottom: 0;margin-top: 100px; text-align: center; padding: 10px; color: grey;\">This email was sent to {Name}, Email:<span style='color: grey'>{Email}</span> <br />by {Organization}, Email: <span style='color: grey'>{SenderEmail} </span>\n" +
      "<br>\n" +
      "If you don't want to receive such emails, <a style=\"color: grey;\" href=\"/unsubscribe/unsubscribe.html?key={keyToUnsubscribe}\" target=\"_blank\" rel=\"noopener\">Unsubscribe from this list</a> . &nbsp;</div>";
    container.appendChild(footer);

    this.emailForm.get('body').setValue(container.innerHTML.toString());

  }

  removeUnsubscribeLink() {
    let body = this.emailForm.get('body').value;
    let container = document.createElement("main");
    container.innerHTML = body;
    container.getElementsByTagName('footer').item(0).innerHTML = ""
    this.emailForm.get('body').setValue(container.innerHTML.toString());

  }

  submit() {
    if (this.listOfRecipients.length > 50) {
      const dialogRef = this.dialog.open(ConfirmationDialogueComponent, {
        width: '400px',
        data: {title: "Please confirm the submission of job for " + this.listOfRecipients.length.toString() + " Recipient."}
      });
      dialogRef.afterClosed().subscribe(result => {
        if (result.event == "Submit") {
          this.sendEmail(result.data);
        }
      });
    } else {
      this.sendEmail("Sending emails to " + this.listOfRecipients.length.toString() + "Recipients");
    }
  }

}

