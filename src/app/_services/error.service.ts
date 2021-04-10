import {Injectable} from '@angular/core';
import {Subject} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ErrorService {
  isError: boolean;
  errorVisibilityChange: Subject<boolean> = new Subject<boolean>();
  messageVisibilityChange: Subject<string> = new Subject<string>();
  message;

  constructor() {
    this.isError = false;
    this.message = "";
  }

  setErrorVisibility(value, message) {
    this.errorVisibilityChange.next(value);
    this.messageVisibilityChange.next(message);
  }

}
