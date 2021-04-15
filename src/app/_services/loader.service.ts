import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable()
export class LoaderService {
    public isLoading = false;
    public loadingState:Subject<boolean> = new Subject<boolean>();
    constructor() {}

    setLoadingState(state: boolean) {
        this.loadingState.next(state);
    }
}


