import { NgModule } from '@angular/core';
import {ReactiveFormsModule} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import {ConfirmationPopoverModule} from "angular-confirmation-popover";
import { ErrorsComponent } from './components/errors/errors.component';
import { MaterialModule } from './material/material.module';
import { DialogOverview } from 'src/app/components/dialog-overview/dialog-overview.component'
import { CustomPaginationComponent } from './components/custom-pagination/custom-pagination.component';
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';
import { EditorModule } from '@tinymce/tinymce-angular';

@NgModule({
    imports:[
        CommonModule, 
        ReactiveFormsModule, 
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
        CustomPaginationComponent 
    ],
    exports:[ 
        ReactiveFormsModule,
        RouterModule,
        CKEditorModule,
        EditorModule,
        ErrorsComponent, 
        DialogOverview, 
        ConfirmationPopoverModule, 
        CustomPaginationComponent
    ],
    entryComponents: [ DialogOverview ]
})
export class SharedModule { }