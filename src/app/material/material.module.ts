import {NgModule} from '@angular/core';
import {
  MatButtonModule,
  MatCardModule,
  MatCheckboxModule,
  MatChipsModule,
  MatDatepickerModule,
  MatDialogModule,
  MatIconModule,
  MatInputModule,
  MatListModule,
  MatNativeDateModule,
  MatPaginatorModule,
  MatProgressSpinnerModule,
  MatSelectModule,
  MatSidenavModule,
  MatSortModule,
  MatTableModule,
  MatTabsModule,
  MatToolbarModule
} from '@angular/material';
import {DialogOverviewExampleDialog} from '../components/recipients/recipients.component';
import {MatSlideToggleModule} from "@angular/material/slide-toggle";


const MaterialComponents = [
  MatSelectModule,
  MatInputModule,
  MatTableModule,
  MatCheckboxModule,
  MatTabsModule,
  MatDatepickerModule,
  MatNativeDateModule,
  MatPaginatorModule,
  MatChipsModule,
  MatToolbarModule,
  MatSidenavModule,
  MatListModule,
  MatButtonModule,
  MatIconModule,
  MatButtonModule,
  MatDialogModule,
  MatSortModule,
  MatProgressSpinnerModule,
  MatCardModule,
  MatSlideToggleModule
];

@NgModule({
  declarations: [],
  imports: [MaterialComponents],
  exports: [MaterialComponents],
  entryComponents: [DialogOverviewExampleDialog]
})
export class MaterialModule {
}
