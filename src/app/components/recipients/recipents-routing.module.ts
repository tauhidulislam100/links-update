import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RecipientsWithFilledComponent } from './recipients-with-filled/recipients-with-filled.component';
import { RecipientsComponent } from './recipients.component';

const routes: Routes = [
    {
        path: '',
        component: RecipientsComponent
    },
    {
        path: 'with/field',
        component: RecipientsWithFilledComponent,
    },
    {
        path: ':id',
        component: RecipientsComponent,
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class RecipentsRoutingModule { }