import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { JobsComponent } from './jobs.component';
import { JobsRoutingModule } from './jobs-routing.module';
import { SharedModule } from 'src/app/shared.module';
import { MaterialModule } from 'src/app/material/material.module';

@NgModule({
  imports: [
    CommonModule,
    JobsRoutingModule,
    SharedModule,
    MaterialModule
  ],
  declarations: [JobsComponent],
  exports: [ JobsComponent ]
})
export class JobsModule { }