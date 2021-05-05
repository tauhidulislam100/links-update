import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatMenuModule } from '@angular/material/menu';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MaterialModule } from 'src/app/material/material.module';
import { SharedModule } from 'src/app/shared.module';
import { EmailJobsRoutingModule } from './email-jobs-routing.module';
import { EmailJobsComponent } from './email-jobs.component';


@NgModule({
  imports: [
    CommonModule,
    EmailJobsRoutingModule,
    SharedModule,
    MaterialModule,
    MatMenuModule,
    MatSlideToggleModule
  ],
  declarations: [EmailJobsComponent],
  exports: [ EmailJobsComponent ]
})
export class EmailJobsModule { }