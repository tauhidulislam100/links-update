import {Injectable} from '@angular/core';
import {Page} from '../pagination/page'
import {Pageable} from '../pagination/pageable'


@Injectable({
  providedIn: 'root'
})
export class CustomPaginationService {

  constructor() {
  }

  public getNextPage(page: Page<any>): Pageable {
    console.log('start next page number ',  page.pageable.pageNumber)
    if (!page.last &&  page.pageable.pageNumber < (page.totalPages)-1) {
      page.pageable.pageNumber = page.pageable.pageNumber + 1;
    }
    console.log('end next page number ', page.pageable.pageNumber)
    return page.pageable;
  }


  public getPreviousPage(page: Page<any>): Pageable {
    console.log('start prev page number ', page.pageable.pageNumber)
    if (!page.first && page.pageable.pageNumber > 0) {
      page.pageable.pageNumber = page.pageable.pageNumber - 1;
    }
    console.log('start prev page number ', page.pageable.pageNumber)
    return page.pageable;
  }

  public getPageInNewSize(page: Page<any>, pageSize: number): Pageable {
    page.pageable.pageSize = pageSize;
    page.pageable.pageNumber = Pageable.FIRST_PAGE_NUMBER;

    return page.pageable;
  }


}
