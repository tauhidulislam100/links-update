import { NgModule } from '@angular/core';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import {ConfirmationPopoverModule} from "angular-confirmation-popover";
import { ErrorsComponent } from './components/errors/errors.component';
import { MaterialModule } from './material/material.module';
import { DialogOverview } from 'src/app/components/dialog-overview/dialog-overview.component'
import { CustomPaginationComponent } from './components/custom-pagination/custom-pagination.component';
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';
import { EditorModule } from '@tinymce/tinymce-angular';
import { NoAuthComponent } from './components/noauth-nav/noauth-nav.component';
import { LoaderComponent } from './components/loader/loader.component';

@NgModule({
    imports:[
        CommonModule, 
        ReactiveFormsModule,
        FormsModule, 
        RouterModule,
        CKEditorModule,
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
    ],
    exports:[ 
        ReactiveFormsModule,
        FormsModule,
        RouterModule,
        CKEditorModule,
        EditorModule,
        ErrorsComponent, 
        DialogOverview, 
        ConfirmationPopoverModule, 
        CustomPaginationComponent,
        NoAuthComponent,
        LoaderComponent,
    ],
    entryComponents: [ DialogOverview ]
})
export class SharedModule { }