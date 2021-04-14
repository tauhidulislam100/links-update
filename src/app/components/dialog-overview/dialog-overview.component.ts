import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SelectionModel } from '@angular/cdk/collections';
import { RecipientService } from '../../_services/recipient.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog'
import {
    validateTag
} from '../../_custome-validators/certificateForm.validator';
import { DialogService } from 'src/app/_services/dialog.service';


export interface UserData {
    checkBox,
    id,
    name,
    email,
    userTags
}

@Component({
    selector: 'dialog-overview',
    templateUrl: 'dialog-overview.component.html',
})
export class DialogOverview implements OnInit {
    action: string;
    local_data: any;
    tagForm: FormGroup;
    title;

    constructor(
        public dialogRef: MatDialogRef<DialogOverview>,
        @Inject(MAT_DIALOG_DATA) public data: DialogData,
        private userService: RecipientService,
        private fb: FormBuilder,
        private dialogService: DialogService) {
        this.title = this.dialogService.getTitle();
        this.tagForm = this.fb.group({
            tagInput: ['', [Validators.required, validateTag()]]
        });
    }

    ngOnInit() {
    }

    selection = new SelectionModel<UserData>(true, []);

    onNoClick(): void {
        this.action = "close";
        this.dialogRef.close();
    }

    addtag(tag) {
        this.local_data = this.tagForm.get('tagInput').value;
        this.action = "AddTag";
        this.dialogRef.close({ event: this.action, data: this.local_data });
    }
}

export interface DialogData {
    tag;
    userForm;
    allUsers: any[];
}
