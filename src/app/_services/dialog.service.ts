import {Injectable} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DialogService {

  title;

  constructor() {
  }

  setTitle(title: String) {
    this.title = title;
  }

  getTitle(): String {
    return this.title;
  }

}
