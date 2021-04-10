import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Page} from '../../pagination/page'

@Component({
  selector: 'app-custom-pagination',
  templateUrl: './custom-pagination.component.html',
  styleUrls: ['./custom-pagination.component.css']
})
export class CustomPaginationComponent implements OnInit {
  @Input() page: Page<any>;
  @Output() nextPageEvent = new EventEmitter();
  @Output() previousPageEvent = new EventEmitter();


  constructor() {
  }

  ngOnInit() {

  }

  nextPage(): void {
    this.nextPageEvent.emit(null);
  }

  previousPage(): void {
    this.previousPageEvent.emit(null);
  }

}
