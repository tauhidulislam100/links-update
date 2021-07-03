import { NgModule } from '@angular/core';
import { Router, RouterModule, Routes } from '@angular/router';
import { AdminProfileEditComponent } from './components/admin-profile-edit/admin-profile-edit.component';
import { AdminProfileComponent } from './components/admin-profile/admin-profile.component';
import { SendEmailComponent } from './components/send-email/send-email.component';
import { FaqComponent } from './components/faq/faq.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { NotFoundComponent } from './not-found/not-found.component';
import { AuthGuardService as AuthGuard } from './_guards/auth-guard.service';
import { LoggedInAuthGuard } from './_guards/logged-in-auth-guard.service';

const routes: Routes = [
  {
    path: 'register',
    loadChildren: () => import('./components/register/register.module').then(m => m.RegisterModule), 
    canActivate: [LoggedInAuthGuard],
  },
  {
    path: 'AdminLogin',
    loadChildren: () => import('./components/login/login.module').then(m => m.LoginModule), 
    canActivate: [LoggedInAuthGuard],
  },
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
        path: 'SendEmail',
        component: SendEmailComponent,
        canActivate: [AuthGuard],
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
        loadChildren: () => import('./components/certificates/certificates.module').then(m => m.CertificatesModule),
        canActivate: [AuthGuard],
      },
      {
        path: 'Emails',
        loadChildren: () => import('./components/emails/emails.module').then(m => m.EmailsModule),
        canActivate: [AuthGuard],
      },
      {
        path: 'AdminProfile',
        component: AdminProfileComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'AdminProfile/Edit',
        component: AdminProfileEditComponent,
         canActivate: [AuthGuard],
      },
      {
        path: 'FAQ', component: FaqComponent
      },
      {
        path: 'FAQ/:title', component: FaqComponent
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
  constructor(private router: Router) {
    this.router.errorHandler = (error: any) => {
    }
  }
}
