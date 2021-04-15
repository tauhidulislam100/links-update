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
import {MaterialModule} from './material/material.module';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {DatePipe, HashLocationStrategy, LocationStrategy} from '@angular/common';
import {CKEditorModule} from '@ckeditor/ckeditor5-angular';
import {NavbarComponent} from './components/navbar/navbar.component';
import {EmailComponent} from './components/email/email.component';
import {ErrorInterceptor} from './_helpers/error.interceptor';
import {EmailJobDetailComponent} from './components/email-job-detail/email-job-detail.component';
import {CertificateJobDetailComponent} from './components/certificate-job-detail/certificate-job-detail.component';
import {EmailJobDetailResolver} from './emailJobDetailResolver';
import {CertificateJobDetailResolver} from './certificateJobDetailResolver';
import {AdminLoginComponent} from './components/admin-login/admin-login.component';
import {AdminProfileComponent} from './components/admin-profile/admin-profile.component';
import {AdminProfileResolver} from './AdminProfileResolver';
import {AdminProfileEditComponent} from './components/admin-profile-edit/admin-profile-edit.component';
import {FaqComponent} from './components/faq/faq.component';
import {CertificateTemplateComponent} from './components/certificate-template/certificate-template.component';
import {UpdateCertificateTemplateResolver} from './UpdateCertificateTemplateResolver';
import {ConfigService} from './_services/config.service';
import {SendEmailGetTemplatesCreatedByAdmin} from './SendEmailGetTemplates';
import {RecipientFieldsResolver} from './RecipientsFieldsResolver';
import {EditorModule, TINYMCE_SCRIPT_SRC} from '@tinymce/tinymce-angular';
import {ConfirmationDialogueComponent} from './components/confirmation-dialogue/confirmation-dialogue.component';
import { UnsubscribeListResolver } from './UnsubscribeListResolver';
import { NotFoundComponent } from './not-found/not-found.component';
import { SharedModule } from './shared.module';
import { LoaderInterceptor } from './_helpers/loader.interceptor';
import { LoaderService } from './_services/loader.service';
import { CacheMapService } from './_services/cache/cache-map.service';
import { Cache } from './_services/cache/cache';
import { CachingInterceptor } from './_helpers/caching.interceptor';
import { SelectedTabService } from './_services/selected-tab.service';

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    EmailComponent,
    // ProfileComponent,
    EmailJobDetailComponent,
    CertificateJobDetailComponent,
    AdminLoginComponent,
    AdminProfileComponent,
    AdminProfileEditComponent,
    FaqComponent,
    CertificateTemplateComponent,
    ConfirmationDialogueComponent,
    NotFoundComponent
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
    SharedModule,
  ],
  exports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    ReactiveFormsModule,
    MaterialModule,
    BrowserAnimationsModule,
    CKEditorModule,
  ],
  providers: [
    AuthenticationService,
    AuthGuardService,
    {provide: JWT_OPTIONS, useValue: JWT_OPTIONS},
    JwtHelperService,
    {provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true},
    {provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true},
    LoaderService,
    {provide: HTTP_INTERCEPTORS, useClass: LoaderInterceptor, multi: true},
    CacheMapService,
    {provide: Cache, useClass: CacheMapService},
    {provide: HTTP_INTERCEPTORS, useClass: CachingInterceptor, multi: true},
    SelectedTabService,
    EmailJobDetailResolver,
    RecipientFieldsResolver,
    CertificateJobDetailResolver,
    AdminProfileResolver,
    SendEmailGetTemplatesCreatedByAdmin,
    UpdateCertificateTemplateResolver,
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
