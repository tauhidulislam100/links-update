import { Component, OnInit } from '@angular/core';
import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EmailService } from 'src/app/_services/email.service';
import { ActivatedRoute } from '@angular/router';
import { ErrorService } from 'src/app/_services/error.service';
import { validateField } from 'src/app/_custome-validators/certificateForm.validator';
import { ConfigService } from 'src/app/_services/config.service';
import { ThemePalette } from "@angular/material/core";
import { FieldService } from 'src/app/_services/field.service';

@Component({
  selector: 'app-email-template',
  templateUrl: './email-template.component.html',
  styleUrls: ['./email-template.component.css']
})
export class EmailTemplateComponent implements OnInit {
  Editor = ClassicEditor;
  assets_loc;
  emailTemplateForm: FormGroup;
  isCreated: boolean;
  emailTemplateDetails;
  isUpdated: boolean;
  fields: any[] = [];
  popoverMessage = "Please confirm to add a new template.";
  popoverTitle = "Add New Template";
  color: ThemePalette = 'accent';
  checked = false;
  disabled = false;

  constructor(
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private emailService: EmailService,
    private errorService: ErrorService,
    private configService: ConfigService,
    private fieldService: FieldService,
  ) {
    this.configService.loadConfigurations().subscribe(data => {
      this.assets_loc = data.assets_location;
    });

    this.fieldService.getAllFields().subscribe(fields => {
      this.fields = fields;
    });
  }

  ngOnInit() {
    this.isCreated = false;
    this.isUpdated = false;
    this.emailTemplateForm = this.fb.group({
      name: ['', Validators.required],
      subject: ['', Validators.required],
      body: ['', Validators.required]
    });

    if (this.route.snapshot.paramMap.get('id') != null && !this.route.snapshot.data['update']) {
      this.emailService.getEmailTemplateByIdAndCreatedBy(this.route.snapshot.paramMap.get('id')).subscribe(templateData => {
        this.updateFields(templateData);
      });
    } else if (this.route.snapshot.paramMap.get('id') != null && this.route.snapshot.data['update'] == true) {
      this.emailService.getEmailTemplateById(this.route.snapshot.paramMap.get('id')).subscribe(templateData => {
        this.updateFields(templateData);
      })
    }

  }

  updateFields(data) {
    this.emailTemplateDetails = data;
    this.emailTemplateForm.get('name').setValue(this.emailTemplateDetails.name);
    this.emailTemplateForm.get('subject').setValue(this.emailTemplateDetails.subject);
    this.emailTemplateForm.get('body').setValue(this.emailTemplateDetails.body);
    this.checked = this.emailTemplateDetails.unsubscribeOptionEnabled;
    this.popoverMessage = "Please confirm to Update.";
    this.popoverTitle = "Update Template";
  }

  addTemplate() {

    this.emailTemplateForm.get('body').setValidators([Validators.required, validateField(this.fields)]);
    this.emailTemplateForm.get('body').updateValueAndValidity();

    if (this.emailTemplateForm.get('body').valid) {


      let name = this.emailTemplateForm.get('name').value;
      let subject = this.emailTemplateForm.get('subject').value;
      let body = this.emailTemplateForm.get('body').value;
      let data = {
        "name": name,
        "subject": subject,
        "body": body,
        "unsubscribeOptionEnabled": this.checked
      }

      if (this.route.snapshot.paramMap.get('id') != null && this.route.snapshot.paramMap.get('type') == null) {

        this.emailService.updateTemplateCreatedBy(this.route.snapshot.paramMap.get('id'), data).subscribe(data => {
          this.isCreated = false;
          this.isUpdated = true;
          this.errorService.setErrorVisibility(false, "");
        })

      } else if (this.route.snapshot.paramMap.get('id') != null && this.route.snapshot.paramMap.get('type') != null) {
        this.emailService.updateTemplate(this.route.snapshot.paramMap.get('id'), data).subscribe(data => {
          this.isCreated = false;
          this.isUpdated = true;
          this.errorService.setErrorVisibility(false, "");
        })
      } else {
        this.emailService.addTemplate(data).subscribe(data => {
          this.isCreated = true;
          this.isUpdated = false;
          this.errorService.setErrorVisibility(false, "");
        });
      }

    }
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
    let body = this.emailTemplateForm.get('body').value;
    let container = document.createElement("main");
    container.innerHTML = body;
    let footer = document.createElement("footer");
    footer.innerHTML = "<div style=\"border-top: 1px solid black;bottom: 0;margin-top: 100px; text-align: center; padding: 10px; color: grey;\">This email was sent to {Name}, Email:<span style='color: grey'>{Email}</span> <br />by {Organization}, Email: <span style='color: grey'>{SenderEmail} </span>\n" +
      "<br>\n" +
      "If you don't want to receive such emails, <a style=\"color: grey;\" href=\"/unsubscribe/unsubscribe.html?key={keyToUnsubscribe}\" target=\"_blank\" rel=\"noopener\">Unsubscribe from this list</a> . &nbsp;</div>";
    container.appendChild(footer);
    this.emailTemplateForm.get('body').setValue(container.innerHTML.toString());
  }

  removeUnsubscribeLink() {
    let body = this.emailTemplateForm.get('body').value;
    let container = document.createElement("main");
    container.innerHTML = body;

    for (let i = 0; i < container.getElementsByTagName('footer').length; i++) {
      container.getElementsByTagName('footer').item(i).innerHTML = "";
    }
    this.emailTemplateForm.get('body').setValue(container.innerHTML.toString());
  }
  
}
