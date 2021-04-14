import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EmailJobsRoutingModule } from './email-jobs-routing.module';
import { EmailJobsComponent } from './email-jobs.component';
import { SharedModule } from 'src/app/shared.module';
import { MaterialModule } from 'src/app/material/material.module';


@NgModule({
  imports: [
    CommonModule,
    EmailJobsRoutingModule,
    SharedModule,
    MaterialModule
  ],
  declarations: [EmailJobsComponent],
  exports: [ EmailJobsComponent ]
})
export class EmailJobsModule { }