import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatMenuModule } from '@angular/material/menu';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MaterialModule } from 'src/app/material/material.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { EmailDetailComponent } from './email-detail/email-detail.component';
import { EmailsRoutingModule } from './emails-routing.module';
import { EmailsComponent } from './emails.component';



@NgModule({
  imports: [
    CommonModule,
    EmailsRoutingModule,
    SharedModule,
    MaterialModule,
    MatMenuModule,
    MatSlideToggleModule,
    MatTooltipModule,
    MatToolbarModule
  ],
  declarations: [
    EmailsComponent,
    EmailDetailComponent
  ],
  exports: [ EmailsComponent ]
})
export class EmailsModule { }