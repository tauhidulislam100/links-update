import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MaterialModule } from 'src/app/material/material.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { TagsRoutingModule } from './tags-routing.module';
import { TagsComponent } from './tags.component';


@NgModule({
  imports: [
    CommonModule,
    TagsRoutingModule,
    SharedModule,
    MaterialModule
  ],
  declarations: [TagsComponent],
  exports: [ TagsComponent ]
})
export class TagsModule { }