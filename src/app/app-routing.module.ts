import { NgModule } from '@angular/core';
import { Router, RouterModule, Routes } from '@angular/router';
import { AdminProfileResolver } from './AdminProfileResolver';
import { CertificateJobDetailResolver } from './certificateJobDetailResolver';
import { AdminProfileEditComponent } from './components/admin-profile-edit/admin-profile-edit.component';
import { AdminProfileComponent } from './components/admin-profile/admin-profile.component';
import { CertificateJobDetailComponent } from './components/certificate-job-detail/certificate-job-detail.component';
import { CertificateTemplateComponent } from './components/certificate-template/certificate-template.component';
import { EmailJobDetailComponent } from './components/email-job-detail/email-job-detail.component';
import { EmailComponent } from './components/email/email.component';
import { FaqComponent } from './components/faq/faq.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { EmailJobDetailResolver } from './emailJobDetailResolver';
import { NotFoundComponent } from './not-found/not-found.component';
import { RecipientFieldsResolver } from './RecipientsFieldsResolver';
import { SendEmailGetTemplatesCreatedByAdmin } from './SendEmailGetTemplates';
import { UpdateCertificateTemplateResolver } from './UpdateCertificateTemplateResolver';
import { AuthGuardService as AuthGuard } from './_guards/auth-guard.service';

const routes: Routes = [
  {
    path: 'register',
    loadChildren: () => import('./components/register/register.module').then(m => m.RegisterModule), 
  },
  {
    path: 'AdminLogin',
    loadChildren: () => import('./components/login/login.module').then(m => m.LoginModule), 
  },
  // { 
  //   path: 'AdminLogin', 
  //   component: AdminLoginComponent 
  // },
  { 
    path: '404', 
    component: NotFoundComponent 
  },
  {
    path: '', component: NavbarComponent,
    children: [
      {
        path: '',
        loadChildren: () => import('./components/home/home.module').then(m => m.HomeModule),
        canActivate: [AuthGuard],
      },
      {
        path: 'Recipients',
        loadChildren: () => import('./components/recipients/recipents.module').then(m => m.RecipentsModule),
        canActivate: [AuthGuard],
      },
      {
        path: 'Recipients/:id',
        loadChildren: () => import('./components/recipients/recipents.module').then(m => m.RecipentsModule),
        canActivate: [AuthGuard],
      },
      {
        path: 'GenerateCertificate',
        loadChildren: () => import('./components/certificate/certificate.module').then(m => m.CertificateModule),
        canActivate: [AuthGuard],
      },
      {
        path: 'SendEmail',
        component: EmailComponent,
        canActivate: [AuthGuard],
        resolve: { fields: RecipientFieldsResolver, templates: SendEmailGetTemplatesCreatedByAdmin }
      },
      {
        path: 'Profile/:id',
        loadChildren: () => import('./components/profile/profile.module').then(m => m.ProfileModule),
        canActivate: [AuthGuard]
      },
      {
        path: 'Tags',
        loadChildren: () => import('./components/tags/tags.module').then(m => m.TagsModule),
        canActivate: [AuthGuard],
      },
      {
        path: 'Certificates',
        loadChildren: () => import('./components/jobs/jobs.module').then(m => m.JobsModule),
        canActivate: [AuthGuard],
      },
      {
        path: 'Emails',
        loadChildren: () => import('./components/email-jobs/email-jobs.module').then(m => m.EmailJobsModule),
        canActivate: [AuthGuard],
      },
      {
        path: 'Emails/View/:id',
        component: EmailJobDetailComponent,
        canActivate: [AuthGuard],
        resolve: { detail: EmailJobDetailResolver }
      },
      {
        path: 'Certificates/View/:id',
        component: CertificateJobDetailComponent,
        canActivate: [AuthGuard],
        resolve: { detail: CertificateJobDetailResolver }
      },
      {
        path: 'AdminProfile',
        component: AdminProfileComponent,
        resolve: { details: AdminProfileResolver }
      },
      {
        path: 'AdminProfile/Edit',
        component: AdminProfileEditComponent, resolve:
          { details: AdminProfileResolver }
      },
      {
        path: 'FAQ', component: FaqComponent
      },
      {
        path: 'FAQ/:title', component: FaqComponent
      },
      {
        path: 'Certificates/AddTemplate',
        component: CertificateTemplateComponent
      },
      {
        path: 'Certificates/AddTemplate/:id',
        component: CertificateTemplateComponent,
        resolve: { templateData: UpdateCertificateTemplateResolver, fields: RecipientFieldsResolver }
      },
      {
        path: 'Emails/AddTemplate/:id/:type',
        loadChildren: () => import('./components/email-template/email-template.module').then(m => m.EmailTemplateModule),
        canActivate: [AuthGuard],
        data: { update: true },
      },
      {
        path: 'Emails/UpdateTemplate/:id',
        loadChildren: () => import('./components/email-template/email-template.module').then(m => m.EmailTemplateModule),
        canActivate: [AuthGuard],
      },
      {
        path: 'Emails/AddTemplate',
        loadChildren: () => import('./components/email-template/email-template.module').then(m => m.EmailTemplateModule),
        canActivate: [AuthGuard],
      }
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
  constructor(private router: Router) {
    this.router.errorHandler = (error: any) => {
      // this.router.navigate(['404']); // or redirect to 404
      console.log("error ", error.message);
    }
  }
}
