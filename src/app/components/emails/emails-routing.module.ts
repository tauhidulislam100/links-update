import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { UnsubscribedComponent } from '../unsubscribed/unsubscribed.component';
import { EmailDetailComponent } from './email-detail/email-detail.component';
import { EmailsComponent } from './emails.component';

const routes: Routes = [
    {
        path: '',
        component: EmailsComponent
    },
    {
        path: 'View/:id',
        component: EmailDetailComponent,
    },
    {
        path: 'UpdateTemplate/:id',
        loadChildren: () => import('./email-template/email-template.module').then(m => m.EmailTemplateModule),
    },
    {
        path: 'AddTemplate/:id/:type',
        loadChildren: () => import('./email-template/email-template.module').then(m => m.EmailTemplateModule),
        data: { update: true },
    },
    {
        path: 'AddTemplate',
        loadChildren: () => import('./email-template/email-template.module').then(m => m.EmailTemplateModule),
    },
    {
        path: 'unsubscribed',
        component: UnsubscribedComponent,
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class EmailsRoutingModule { }