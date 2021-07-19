import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { EditorModule } from '@tinymce/tinymce-angular';
import { ConfirmationPopoverModule } from "angular-confirmation-popover";
import { DialogOverview } from 'src/app/components/dialog-overview/dialog-overview.component';
import { CustomPaginationComponent } from '../components/custom-pagination/custom-pagination.component';
import { ErrorsComponent } from '../components/errors/errors.component';
import { LoaderComponent } from '../components/loader/loader.component';
import { NoAuthComponent } from '../components/noauth-nav/noauth-nav.component';
import { UnsubscribedComponent } from '../components/unsubscribed/unsubscribed.component';
import { MaterialModule } from '../material/material.module';
import { DateAgoPipe } from '../pipes/date-ago.pipe';


@NgModule({
    imports:[
        CommonModule, 
        ReactiveFormsModule,
        FormsModule, 
        RouterModule,
        EditorModule,
        ConfirmationPopoverModule.forRoot({
            confirmButtonType: 'danger'
        }),
        MaterialModule,
    ],
    declarations:[ 
        ErrorsComponent, 
        DialogOverview, 
        CustomPaginationComponent,
        NoAuthComponent,
        LoaderComponent,
        DateAgoPipe, 
        UnsubscribedComponent,
    ],
    exports:[ 
        ReactiveFormsModule,
        FormsModule,
        RouterModule,
        EditorModule,
        ErrorsComponent, 
        DialogOverview, 
        ConfirmationPopoverModule, 
        CustomPaginationComponent,
        NoAuthComponent,
        LoaderComponent,
        DateAgoPipe,
    ],
    entryComponents: [ DialogOverview ]
})
export class SharedModule { }