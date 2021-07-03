import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatMenuModule } from '@angular/material/menu';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MaterialModule } from 'src/app/material/material.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { CertificatesRoutingModule } from './certificates-routing.module';
import { CertificatesComponent } from './certificates.component';
import { CertificateDetailComponent } from './certificate-detail/certificate-detail.component'
import { AddCertificateComponent } from './add-certificate/add-certificate.component';
import { CertificateTemplateComponent } from './certificate-template/certificate-template.component';
import { GenerateCertificateComponent } from './generate-certificate/generate-certificate.component';

@NgModule({
  imports: [
    CommonModule,
    CertificatesRoutingModule,
    SharedModule,
    MaterialModule,
    MatMenuModule,
    MatSlideToggleModule
  ],
  declarations: [
    CertificatesComponent, 
    CertificateDetailComponent,
    AddCertificateComponent,
    CertificateTemplateComponent,
    GenerateCertificateComponent,
  ],
  exports: [ 
    CertificatesComponent, 
    CertificateDetailComponent 
  ]
})
export class CertificatesModule { }