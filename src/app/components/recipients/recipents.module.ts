import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RecipentsRoutingModule } from './recipents-routing.module';
import { RecipientsComponent } from './recipients.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { MaterialModule } from 'src/app/material/material.module';


@NgModule({
  imports: [
    CommonModule,
    RecipentsRoutingModule,
    SharedModule,
    MaterialModule
  ],
  declarations: [RecipientsComponent],
  exports: [ RecipientsComponent ],
})
export class RecipentsModule { }