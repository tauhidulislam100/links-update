import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { EmailJobsComponent } from './email-jobs.component';

const routes: Routes = [
    {
        path: '',
        component: EmailJobsComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class EmailJobsRoutingModule { }