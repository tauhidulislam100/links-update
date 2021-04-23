import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable()
export class SelectedTabService {
    private selectedTabs: Record<string, number> = {};


    setTab(pageName: string, tabIndex = 0) {
        this.selectedTabs[pageName] = tabIndex;
        console.log(this.selectedTabs);
    }

    getTab(pageName: string) {
        console.log(this.selectedTabs);
        return this.selectedTabs[pageName] !== undefined ? this.selectedTabs[pageName] : 0;
    }
}