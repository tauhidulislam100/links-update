import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatMenuModule } from '@angular/material/menu';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MaterialModule } from 'src/app/material/material.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { EmailJobsRoutingModule } from './email-jobs-routing.module';
import { EmailJobsComponent } from './email-jobs.component';



@NgModule({
  imports: [
    CommonModule,
    EmailJobsRoutingModule,
    SharedModule,
    MaterialModule,
    MatMenuModule,
    MatSlideToggleModule,
    MatTooltipModule,
    MatToolbarModule
  ],
  declarations: [EmailJobsComponent],
  exports: [ EmailJobsComponent ]
})
export class EmailJobsModule { }