import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CertificatesComponent } from './certificates.component';
import { CertificateDetailComponent } from './certificate-detail/certificate-detail.component'
import { AddCertificateComponent } from './add-certificate/add-certificate.component';
import { CertificateTemplateComponent } from './certificate-template/certificate-template.component';
import { GenerateCertificateComponent } from './generate-certificate/generate-certificate.component';

const routes: Routes = [
  {
    path: '',
    component: CertificatesComponent
  },
  {
    path: 'View/:id',
    component: CertificateDetailComponent,
  },
  {
    path: 'AddTemplate',
    component: AddCertificateComponent,
  },
  {
    path: 'AddTemplate/:id',
    component: CertificateTemplateComponent,
  },
  {
    path: 'Generate',
    component: GenerateCertificateComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CertificatesRoutingModule { }