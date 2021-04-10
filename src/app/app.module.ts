import {BrowserModule} from '@angular/platform-browser';
import {APP_INITIALIZER, NgModule} from '@angular/core';
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';
import {ReactiveFormsModule} from '@angular/forms';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {AuthenticationService} from './_services/authentication.service';
import {AuthGuardService} from './_guards/auth-guard.service';
import {JWT_OPTIONS, JwtHelperService} from '@auth0/angular-jwt';
import {JwtInterceptor} from './_helpers/jwt.interceptor';
import {DialogOverviewExampleDialog, RecipientsComponent} from './components/recipients/recipients.component';
import {Resolver} from './resolver';
import {MaterialModule} from './material/material.module';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {CertificateResolver} from './certificateResolver';
import {DatePipe, HashLocationStrategy, LocationStrategy} from '@angular/common';
import {CKEditorModule} from '@ckeditor/ckeditor5-angular';
import {NavbarComponent} from './components/navbar/navbar.component';
import {TagsComponent} from './components/tags/tags.component';
import {EmailComponent} from './components/email/email.component';
import {CertificateComponent} from './components/certificate/certificate.component';
import {ProfileComponent} from './components/profile/profile.component';
import {JobsComponent} from './components/jobs/jobs.component';
import {TagsResolver} from './tagsResolver';
import {ErrorInterceptor} from './_helpers/error.interceptor';
import {EmailJobsComponent} from './components/email-jobs/email-jobs.component';
import {EmailJobResolver} from './emailJobResolver';
import {EmailJobDetailComponent} from './components/email-job-detail/email-job-detail.component';
import {CertificateJobDetailComponent} from './components/certificate-job-detail/certificate-job-detail.component';
import {EmailJobDetailResolver} from './emailJobDetailResolver';
import {CertificateJobDetailResolver} from './certificateJobDetailResolver';
import {ProfileResolver} from './profileResolver';
import {AdminLoginComponent} from './components/admin-login/admin-login.component';
import {AdminProfileComponent} from './components/admin-profile/admin-profile.component';
import {AdminProfileResolver} from './AdminProfileResolver';
import {AdminProfileEditComponent} from './components/admin-profile-edit/admin-profile-edit.component';
import {HomeComponent} from './components/home/home.component';
import {FaqComponent} from './components/faq/faq.component';
import {CertificateTemplateComponent} from './components/certificate-template/certificate-template.component';
import {EmailTemplateComponent} from './components/email-template/email-template.component';
import {NavBarResolver} from './navbarResolver';
import {LoginComponent} from './components/login/login.component';
import {RecipientsResolver} from './RecipientsResolver';
import {CertificateTemplatesResolver} from './CertificateTemplatesResolver';
import {EmailTemplatesResolver} from './EmailTemplatesResolver';
import {FieldResolver} from './FieldResolver';
import {UpdateEmailTemplateResolver} from './UpdateEmailTemplateResolver';
import {UpdateCertificateTemplateResolver} from './UpdateCertificateTemplateResolver';
import {ErrorsComponent} from './components/errors/errors.component';
import {HomeResolver} from './HomeResolver';
import {EmailTemplatesCreatedByAdmin} from './EmailTemplatesCreatedByAdmin';
import {EmailTemplateCreatedByResolver} from './EmailTemplateCreatedByResolver';
import {ConfigService} from './_services/config.service';
import {CustomPaginationComponent} from './components/custom-pagination/custom-pagination.component';
import {GenerateCertificateTemplatesResolver} from './GenerateCertificateTemplatesResolver';
import {SendEmailGetTemplatesCreatedByAdmin} from './SendEmailGetTemplates';
import {RecipientFieldsResolver} from './RecipientsFieldsResolver';
import {EditorModule, TINYMCE_SCRIPT_SRC} from '@tinymce/tinymce-angular';
import {ConfirmationPopoverModule} from "angular-confirmation-popover";
import {ConfirmationDialogueComponent} from './components/confirmation-dialogue/confirmation-dialogue.component';
import { UnsubscribeListResolver } from './UnsubscribeListResolver';


@NgModule({
  declarations: [
    AppComponent,
    RecipientsComponent,
    NavbarComponent,
    TagsComponent,
    EmailComponent,
    CertificateComponent,
    ProfileComponent,
    JobsComponent,
    DialogOverviewExampleDialog,
    EmailJobsComponent,
    EmailJobDetailComponent,
    CertificateJobDetailComponent,
    AdminLoginComponent,
    AdminProfileComponent,
    AdminProfileEditComponent,
    HomeComponent,
    FaqComponent,
    CertificateTemplateComponent,
    EmailTemplateComponent,
    LoginComponent,
    ErrorsComponent,
    CustomPaginationComponent,
    ConfirmationDialogueComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    ReactiveFormsModule,
    MaterialModule,
    BrowserAnimationsModule,
    CKEditorModule,
    EditorModule,
    ConfirmationPopoverModule.forRoot({
      confirmButtonType: 'danger'
    }),

  ],
  exports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    ReactiveFormsModule,
    MaterialModule,
    BrowserAnimationsModule,
    CKEditorModule
  ],
  providers: [AuthenticationService,
    AuthGuardService,
    {provide: JWT_OPTIONS, useValue: JWT_OPTIONS},
    JwtHelperService,
    {provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true},
    {provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true},
    Resolver,
    CertificateResolver,
    GenerateCertificateTemplatesResolver,
    TagsResolver,
    EmailJobDetailResolver,
    EmailJobResolver,
    RecipientFieldsResolver,
    CertificateJobDetailResolver,
    ProfileResolver,
    AdminProfileResolver,
    NavBarResolver,
    RecipientsResolver,
    CertificateTemplatesResolver,
    EmailTemplatesResolver,
    FieldResolver,
    SendEmailGetTemplatesCreatedByAdmin,
    UpdateEmailTemplateResolver,
    UpdateCertificateTemplateResolver,
    HomeResolver,
    EmailTemplatesCreatedByAdmin,
    EmailTemplateCreatedByResolver,
    UnsubscribeListResolver,
    DatePipe,
    {provide: LocationStrategy, useClass: HashLocationStrategy},
    {provide: TINYMCE_SCRIPT_SRC, useValue: 'tinymce/tinymce.min.js'},
    {
      provide: APP_INITIALIZER,
      useFactory: (envConfigService: ConfigService) => function () {
        return envConfigService.loadConfigurations().toPromise()
      },
      deps: [ConfigService],
      multi: true
    }


  ],
  entryComponents: [ConfirmationDialogueComponent],
  bootstrap: [AppComponent]
})
export class AppModule {


}
