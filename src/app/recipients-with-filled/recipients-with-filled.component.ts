import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-recipients-with-filled',
  templateUrl: './recipients-with-filled.component.html',
  styleUrls: ['./recipients-with-filled.component.css']
})
export class RecipientsWithFilledComponent implements OnInit {


  constructor(private location: Location) { }

  goBack() {
    this.location.back()
  }

  ngOnInit() {
  }

}
