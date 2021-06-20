import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
// import {ReactiveFormsModule} from '@angular/forms';
import { RecipentsRoutingModule } from './recipents-routing.module';
import { RecipientsComponent } from './recipients.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { MaterialModule } from 'src/app/material/material.module';
// import { DialogOverview } from 'src/app/components/dialog-overview/dialog-overview.component'

@NgModule({
  imports: [
    CommonModule,
    // ReactiveFormsModule,
    RecipentsRoutingModule,
    SharedModule,
    MaterialModule
  ],
  declarations: [RecipientsComponent],
  exports: [ RecipientsComponent ],
  // entryComponents: [ DialogOverview ]
})
export class RecipentsModule { }