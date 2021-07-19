import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FieldService } from 'src/app/_services/field.service';
import { RecipientService } from 'src/app/_services/recipient.service';

@Component({
  selector: 'app-recipients-with-filled',
  templateUrl: './recipients-with-filled.component.html',
  styleUrls: ['./recipients-with-filled.component.css']
})
export class RecipientsWithFilledComponent implements OnInit {
  recipents = [];
  fields = [];
  fieldName = '';
  constructor(private location: Location, private route: ActivatedRoute, private recipentService: RecipientService, private fieldService: FieldService) { }

  goBack() {
    this.location.back()
  }

  ngOnInit() {
    const exists =  this.route.snapshot.queryParamMap.get('exists');
    const notExists =  this.route.snapshot.queryParamMap.get('not-exists');
    this.fieldName = exists || notExists;
    this.recipentService.getUsersWithField(exists||notExists, exists !== null).subscribe((result: any) => {
      this.recipents = result.recipientsToPreview;
    })
    this.fieldService.getAllFields().subscribe(data => {
      this.fields = data;
    });

  }

}
