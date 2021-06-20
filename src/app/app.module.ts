import { DatePipe, HashLocationStrategy, LocationStrategy } from '@angular/common';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { APP_INITIALIZER, NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { JwtHelperService, JWT_OPTIONS } from '@auth0/angular-jwt';
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';
import { EditorModule, TINYMCE_SCRIPT_SRC } from '@tinymce/tinymce-angular';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AddCertificateComponent } from './components/add-certificate/add-certificate.component';
import { AdminLoginComponent } from './components/admin-login/admin-login.component';
import { AdminProfileEditComponent } from './components/admin-profile-edit/admin-profile-edit.component';
import { AdminProfileComponent } from './components/admin-profile/admin-profile.component';
import { CertificateJobDetailComponent } from './components/certificate-job-detail/certificate-job-detail.component';
import { CertificateTemplateComponent } from './components/certificate-template/certificate-template.component';
import { ConfirmationDialogueComponent } from './components/confirmation-dialogue/confirmation-dialogue.component';
import { EmailJobDetailComponent } from './components/email-job-detail/email-job-detail.component';
import { EmailComponent } from './components/email/email.component';
import { FaqComponent } from './components/faq/faq.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { MaterialModule } from './material/material.module';
import { NotFoundComponent } from './not-found/not-found.component';
import { SharedModule } from './shared/shared.module';
import { AuthGuardService } from './_guards/auth-guard.service';
import { CachingInterceptor } from './_helpers/caching.interceptor';
import { ErrorInterceptor } from './_helpers/error.interceptor';
import { JwtInterceptor } from './_helpers/jwt.interceptor';
import { LoaderInterceptor } from './_helpers/loader.interceptor';
import { AuthenticationService } from './_services/authentication.service';
import { Cache } from './_services/cache/cache';
import { CacheMapService } from './_services/cache/cache-map.service';
import { ConfigService } from './_services/config.service';
import { LoaderService } from './_services/loader.service';
import { SelectedTabService } from './_services/selected-tab.service';
import { LoggedInAuthGuard } from './_guards/logged-in-auth-guard.service';

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    EmailComponent,
    EmailJobDetailComponent,
    CertificateJobDetailComponent,
    AdminLoginComponent,
    AdminProfileComponent,
    AdminProfileEditComponent,
    FaqComponent,
    CertificateTemplateComponent,
    ConfirmationDialogueComponent,
    NotFoundComponent,
    AddCertificateComponent,
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
    LoggedInAuthGuard,
    { provide: JWT_OPTIONS, useValue: JWT_OPTIONS },
    JwtHelperService,
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
    LoaderService,
    { provide: HTTP_INTERCEPTORS, useClass: LoaderInterceptor, multi: true },
    CacheMapService,
    { provide: Cache, useClass: CacheMapService },
    { provide: HTTP_INTERCEPTORS, useClass: CachingInterceptor, multi: true },
    SelectedTabService,
    DatePipe,
    { provide: LocationStrategy, useClass: HashLocationStrategy },
    { provide: TINYMCE_SCRIPT_SRC, useValue: 'tinymce/tinymce.min.js' },
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
