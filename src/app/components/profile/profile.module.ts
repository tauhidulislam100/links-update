import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatMenuModule } from '@angular/material/menu';
import { MaterialModule } from 'src/app/material/material.module';
import { SharedModule } from 'src/app/shared.module';
import { ProfileRoutingModule } from './profile-routing.module';
import { ProfileComponent } from './profile.component';


@NgModule({
  imports: [
    CommonModule,
    ProfileRoutingModule,
    SharedModule,
    MaterialModule,
    MatMenuModule
  ],
  declarations: [ProfileComponent],
  exports: [ 
    ProfileComponent,
    
  ]
})
export class ProfileModule {
  
 }