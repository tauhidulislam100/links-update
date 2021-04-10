import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {AuthGuardService as AuthGuard} from './_guards/auth-guard.service';
import {RecipientsComponent} from './components/recipients/recipients.component';
import {Resolver} from './resolver';
import {CertificateResolver} from './certificateResolver';
import {TagsResolver} from './tagsResolver';
import {CertificateComponent} from './components/certificate/certificate.component';
import {EmailComponent} from './components/email/email.component';
import {ProfileComponent} from './components/profile/profile.component';
import {TagsComponent} from './components/tags/tags.component';
import {JobsComponent} from './components/jobs/jobs.component';
import {EmailJobsComponent} from './components/email-jobs/email-jobs.component';
import {EmailJobResolver} from './emailJobResolver';
import {EmailJobDetailComponent} from './components/email-job-detail/email-job-detail.component';
import {CertificateJobDetailComponent} from './components/certificate-job-detail/certificate-job-detail.component';
import {EmailJobDetailResolver} from './emailJobDetailResolver';
import {CertificateJobDetailResolver} from './certificateJobDetailResolver';
import {ProfileResolver} from './profileResolver';
import {NavBarResolver} from './navbarResolver';
import {AdminLoginComponent} from './components/admin-login/admin-login.component';
import {AdminProfileComponent} from './components/admin-profile/admin-profile.component';
import {AdminProfileResolver} from './AdminProfileResolver';
import {AdminProfileEditComponent} from './components/admin-profile-edit/admin-profile-edit.component';
import {HomeComponent} from './components/home/home.component';
import {FaqComponent} from './components/faq/faq.component';
import {CertificateTemplateComponent} from './components/certificate-template/certificate-template.component';
import {EmailTemplateComponent} from './components/email-template/email-template.component';
import {NavbarComponent} from './components/navbar/navbar.component';
import {RecipientsResolver} from './RecipientsResolver';
import {CertificateTemplatesResolver} from './CertificateTemplatesResolver';
import {EmailTemplatesResolver} from './EmailTemplatesResolver';
import {FieldResolver} from './FieldResolver';
import {UpdateEmailTemplateResolver} from './UpdateEmailTemplateResolver';
import {UpdateCertificateTemplateResolver} from './UpdateCertificateTemplateResolver';
import {HomeResolver} from './HomeResolver';
import {EmailTemplatesCreatedByAdmin} from './EmailTemplatesCreatedByAdmin';
import {EmailTemplateCreatedByResolver} from './EmailTemplateCreatedByResolver';
import {GenerateCertificateTemplatesResolver} from './GenerateCertificateTemplatesResolver';
import {SendEmailGetTemplatesCreatedByAdmin} from './SendEmailGetTemplates';
import {RecipientFieldsResolver} from './RecipientsFieldsResolver';
import { UnsubscribeListResolver } from './UnsubscribeListResolver';

const routes: Routes = [
  {path: 'AdminLogin', component: AdminLoginComponent},
  {
    path: '', component: NavbarComponent, resolve: {data: NavBarResolver},
    children: [
      {path: '', component: HomeComponent, resolve: { summary: HomeResolver}},
      {
        path: 'Recipients',
        component: RecipientsComponent,
        canActivate: [AuthGuard],
        resolve: {newUsers: RecipientsResolver, fields: RecipientFieldsResolver}
      },
      {
        path: 'Recipients/:id',
        component: RecipientsComponent,
        canActivate: [AuthGuard],
        resolve: {users: Resolver, fields: RecipientFieldsResolver}
      },
      {
        path: 'GenerateCertificate',
        component: CertificateComponent,
        canActivate: [AuthGuard],
        resolve: {templates: GenerateCertificateTemplatesResolver}
      },
      {
        path: 'SendEmail',
        component: EmailComponent,
        canActivate: [AuthGuard],
        resolve: {fields: RecipientFieldsResolver, templates: SendEmailGetTemplatesCreatedByAdmin}
      },
      {
        path: 'Profile/:id',
        component: ProfileComponent,
        canActivate: [AuthGuard],
        resolve: {detail: ProfileResolver, fields: RecipientFieldsResolver}
      },
      {
        path: 'Tags',
        component: TagsComponent,
        canActivate: [AuthGuard],
        resolve: {tags: TagsResolver, fields: FieldResolver}
      },
      {
        path: 'Certificates',
        component: JobsComponent,
        canActivate: [AuthGuard],
        resolve: {jobs: CertificateResolver, templates: CertificateTemplatesResolver}
      },
      {
        path: 'Emails',
        component: EmailJobsComponent,
        canActivate: [AuthGuard],
        resolve: {
          jobs: EmailJobResolver,
          templates: EmailTemplatesCreatedByAdmin,
          mappedTemplates: EmailTemplatesResolver,
          // unsubscribedlist: UnsubscribeListResolver
        }
      },
      {
        path: 'Emails/View/:id',
        component: EmailJobDetailComponent,
        canActivate: [AuthGuard],
        resolve: {detail: EmailJobDetailResolver}
      },
      {
        path: 'Certificates/View/:id',
        component: CertificateJobDetailComponent,
        canActivate: [AuthGuard],
        resolve: {detail: CertificateJobDetailResolver}
      },
      {path: 'AdminProfile', component: AdminProfileComponent, resolve: {details: AdminProfileResolver}},
      {path: 'AdminProfile/Edit', component: AdminProfileEditComponent, resolve: {details: AdminProfileResolver}},
      {path: 'FAQ', component: FaqComponent},
      {path: 'FAQ/:title', component: FaqComponent},
      {path: 'Certificates/AddTemplate', component: CertificateTemplateComponent},
      {
        path: 'Certificates/AddTemplate/:id',
        component: CertificateTemplateComponent,
        resolve: {templateData: UpdateCertificateTemplateResolver, fields: RecipientFieldsResolver}
      },
      {
        path: 'Emails/AddTemplate/:id/:type',
        component: EmailTemplateComponent,
        canActivate: [AuthGuard],
        resolve: {templateData: UpdateEmailTemplateResolver, fields: RecipientFieldsResolver}
      },
      {
        path: 'Emails/UpdateTemplate/:id',
        component: EmailTemplateComponent,
        canActivate: [AuthGuard],
        resolve: {templateData: EmailTemplateCreatedByResolver, fields: RecipientFieldsResolver}
      },
      {path: 'Emails/AddTemplate', component: EmailTemplateComponent, resolve: {fields: RecipientFieldsResolver}}
    ]
  }
  // { path: 'Recipients',component: RecipientsComponent, canActivate: [AuthGuard], resolve: {newUsers : RecipientsResolver, fields:RecipientFieldsResolver} } ,
  // { path: 'Recipients/:id', component: RecipientsComponent,canActivate: [AuthGuard], resolve: { users: Resolver,fields:RecipientFieldsResolver } },
  // { path: 'GenerateCertificate', component: CertificateComponent,canActivate: [AuthGuard],resolve: { templates: GenerateCertificateTemplatesResolver }  },
  // { path: 'SendEmail', component: EmailComponent ,canActivate: [AuthGuard], resolve: { fields:FieldResolver ,templates: SendEmailGetTemplatesCreatedByAdmin }},
  // { path: 'Profile/:id', component: ProfileComponent,canActivate: [AuthGuard],resolve: {detail: ProfileResolver,fields:RecipientFieldsResolver}},
  // { path: 'Tags', component: TagsComponent ,canActivate: [AuthGuard],resolve: { tags: TagsResolver, fields:FieldResolver }},
  // { path: 'Certificates', component: JobsComponent ,canActivate: [AuthGuard],resolve: { jobs: CertificateResolver, templates: CertificateTemplatesResolver }},
  // { path: 'Emails', component: EmailJobsComponent ,canActivate: [AuthGuard],resolve: { jobs: EmailJobResolver, templates: EmailTemplatesCreatedByAdmin , mappedTemplates: EmailTemplatesResolver  }},
  // { path: 'Emails/View/:id', component: EmailJobDetailComponent ,canActivate: [AuthGuard],resolve: {detail: EmailJobDetailResolver}},
  // { path: 'Certificates/View/:id', component: CertificateJobDetailComponent ,canActivate: [AuthGuard],resolve: {detail: CertificateJobDetailResolver}},
  // { path: 'AdminProfile', component: AdminProfileComponent,resolve: {details: AdminProfileResolver}},
  // { path: 'AdminProfile/Edit', component: AdminProfileEditComponent,resolve: {details: AdminProfileResolver}} ,
  // { path: 'FAQ', component: FaqComponent},
  // { path: 'Certificates/AddTemplate', component: CertificateTemplateComponent},
  // { path: 'Certificates/AddTemplate/:id', component: CertificateTemplateComponent, resolve: { templateData: UpdateCertificateTemplateResolver, fields:RecipientFieldsResolver }},
  // { path: 'Emails/AddTemplate/:id/:type', component: EmailTemplateComponent, canActivate: [AuthGuard],resolve: {templateData: UpdateEmailTemplateResolver, fields:RecipientFieldsResolver }},
  // { path: 'Emails/UpdateTemplate/:id', component: EmailTemplateComponent, canActivate: [AuthGuard],resolve: {templateData: EmailTemplateCreatedByResolver, fields:RecipientFieldsResolver }},
  // { path: 'Emails/AddTemplate', component: EmailTemplateComponent , resolve: {fields:RecipientFieldsResolver }},

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
