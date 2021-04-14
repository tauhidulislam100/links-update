import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CertificateRoutingModule } from './certificate-routing.module';
import { CertificateComponent } from './certificate.component';
import { SharedModule } from 'src/app/shared.module';
import { MaterialModule } from 'src/app/material/material.module';


@NgModule({
  imports: [
    CommonModule,
    CertificateRoutingModule,
    SharedModule,
    MaterialModule
  ],
  declarations: [CertificateComponent],
  exports: [ CertificateComponent ]
})
export class CertificateModule { }