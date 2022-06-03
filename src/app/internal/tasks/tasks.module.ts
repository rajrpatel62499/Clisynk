import {NgModule} from '@angular/core';
import {SharedModule} from '../../shared/modules/shared.module';
import {TasksComponent} from './tasks.component';
import {RouterModule, Routes} from '@angular/router';
import {AuthGuardService as AuthGuard} from '../../services/authguard.service';
import {FullCalendarModule} from '@fullcalendar/angular';
import { TimelineViewComponent } from './timeline-view/timeline-view.component';
import { CalenderViewComponent } from './calender-view/calender-view.component';
import { TaskFilesComponent } from './task-files/task-files.component';

const routes: Routes = [
    {
        path: '', children: [
            {
                path: '',
                component: TasksComponent,
                data: {title: 'Tasks'},
                canActivate: [AuthGuard]
            }
        ]
    }
];

@NgModule({
    imports: [
        SharedModule,
        RouterModule.forChild(routes),
        FullCalendarModule
    ],
    declarations: [
        TasksComponent,
        TimelineViewComponent,
        CalenderViewComponent,
        TaskFilesComponent,
    ],
})
export class TasksModule {
}
