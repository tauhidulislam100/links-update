import {Component, Inject, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {SelectionModel} from "@angular/cdk/collections";
import {UserData} from "../recipients/recipients.component";

@Component({
  selector: 'app-confirmation-dialogue',
  templateUrl: './confirmation-dialogue.component.html',
  styleUrls: ['./confirmation-dialogue.component.css']
})
export class ConfirmationDialogueComponent implements OnInit {
  action: string;
  local_data: any;
  form: FormGroup;
  title;

  constructor(public dialogRef: MatDialogRef<ConfirmationDialogueComponent>,
              @Inject(MAT_DIALOG_DATA) public data: DialogData,
              private fb: FormBuilder) {
    this.title = data['title'];
    this.form = this.fb.group({
      comment: ['', [Validators.required]]
    });
  }

  ngOnInit() {
  }

  selection = new SelectionModel<UserData>(true, []);

  onNoClick(): void {
    this.action = "close";
    this.dialogRef.close({event: this.action});
  }

  submit() {
    this.local_data = this.form.get('comment').value;
    this.action = "Submit";
    this.dialogRef.close({event: this.action, data: this.local_data});
  }
}

export interface DialogData {
  data;
}
