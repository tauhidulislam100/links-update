import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProfileRoutingModule } from './profile-routing.module';
import { ProfileComponent } from './profile.component';
import { SharedModule } from 'src/app/shared.module';
import { MaterialModule } from 'src/app/material/material.module';


@NgModule({
  imports: [
    CommonModule,
    ProfileRoutingModule,
    SharedModule,
    MaterialModule
  ],
  declarations: [ProfileComponent],
  exports: [ ProfileComponent ]
})
export class ProfileModule { }