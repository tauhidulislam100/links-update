import {Injectable} from '@angular/core';
import {Resolve} from '@angular/router';
import {Observable} from 'rxjs';
import {Page} from './pagination/page';
import {TagService} from './_services/tag.service';


@Injectable()
export class TagsResolver implements Resolve<Observable<string>> {
  constructor(private tagsService: TagService) {
  }

  page: Page<any> = new Page();

  resolve() {
    return this.tagsService.getAllTagsPage(this.page.pageable);
  }
}
