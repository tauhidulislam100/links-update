import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
// import { ReactiveFormsModule } from '@angular/forms';
import { TagsRoutingModule } from './tags-routing.module';
import { TagsComponent } from './tags.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { MaterialModule } from 'src/app/material/material.module';


@NgModule({
  imports: [
    CommonModule,
    // ReactiveFormsModule,
    TagsRoutingModule,
    SharedModule,
    MaterialModule
  ],
  declarations: [TagsComponent],
  exports: [ TagsComponent ]
})
export class TagsModule { }