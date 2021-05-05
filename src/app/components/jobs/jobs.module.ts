import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatMenuModule } from '@angular/material/menu';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MaterialModule } from 'src/app/material/material.module';
import { SharedModule } from 'src/app/shared.module';
import { JobsRoutingModule } from './jobs-routing.module';
import { JobsComponent } from './jobs.component';


@NgModule({
  imports: [
    CommonModule,
    JobsRoutingModule,
    SharedModule,
    MaterialModule,
    MatMenuModule,
    MatSlideToggleModule
  ],
  declarations: [JobsComponent],
  exports: [ JobsComponent ]
})
export class JobsModule { }