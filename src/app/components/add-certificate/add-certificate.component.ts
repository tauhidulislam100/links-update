import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-add-certificate',
  templateUrl: './add-certificate.component.html',
  styleUrls: ['./add-certificate.component.css']
})
export class AddCertificateComponent implements OnInit {

  constructor(private location: Location) { 
    
  }

  ngOnInit() {
  }

  goBack() {
    this.location.back()
  }

}
