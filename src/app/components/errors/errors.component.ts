import {Component, OnInit} from '@angular/core';
import {ErrorService} from 'src/app/_services/error.service';

@Component({
  selector: 'app-errors',
  templateUrl: './errors.component.html',
  styleUrls: ['./errors.component.css']
})
export class ErrorsComponent implements OnInit {
  message = "";
  isError: boolean;

  constructor(public errorService: ErrorService) {
    this.errorService.errorVisibilityChange.subscribe(data => {
      this.isError = data;
    });
    this.errorService.messageVisibilityChange.subscribe(data => this.message = data);
  }

  ngOnInit() {
  }


}
