import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RecipientsComponent } from './recipients.component';

const routes: Routes = [
    {
        path: '',
        component: RecipientsComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class RecipentsRoutingModule { }