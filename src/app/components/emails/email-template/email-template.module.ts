import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EmailTemplateRoutingModule } from './email-template-routing.module';
import { EmailTemplateComponent } from './email-template.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { MaterialModule } from 'src/app/material/material.module';


@NgModule({
  imports: [
    CommonModule,
    EmailTemplateRoutingModule,
    SharedModule,
    MaterialModule
  ],
  declarations: [EmailTemplateComponent],
  exports: [ EmailTemplateComponent ]
})
export class EmailTemplateModule { }