import {NgModule} from '@angular/core';
import {SharedModule} from '../shared/modules/shared.module';
import {CommonModule} from '@angular/common';
import {SplitwordPipe} from '../shared/pipes/splitword.pipe';
import {InternalComponent} from './internal.component';
import {ClickOutsideModule} from 'ng-click-outside';
import {TopNavBarComponent} from '../common/topNavBar/topNavBar.component';
import {SideBarComponent} from '../common/sideBar/sideBar.component';
import {FooterComponent} from '../common/footer/footer.component';
import {ChartsModule} from 'ng2-charts';
import {RouterModule, Routes} from '@angular/router';
import { TodoComponent } from './actions/todo/todo.component';


const routes: Routes = [{
    path: '', component: InternalComponent,
    children: [
        {
            path: 'documents',
            loadChildren: () => import('./documents/documents.module').then(m => m.DocumentsModule)
        },
        {
            path: 'home',
            loadChildren: () => import('./home/home.module').then(m => m.HomeModule)
        }, {
            path: 'contacts',
            loadChildren: () => import('./contacts/contacts.module').then(m => m.ContactsModule)
        }, {
            path: 'tasks',
            loadChildren: () => import('./tasks/tasks.module').then(m => m.TasksModule)
        }, {
            path: 'appointments',
            loadChildren: () => import('./appointments/appointments.module').then(m => m.AppointmentsModule)
        }, {
            path: 'money',
            loadChildren: () => import('./money/money.module').then(m => m.MoneyModule)
        }, {
            path: 'broadcast',
            loadChildren: () => import('./broadcast/broadcast.module').then(m => m.BroadcastModule)
        }, {
            path: 'pipeline',
            loadChildren: () => import('./pipeline/pipeline.module').then(m => m.PipelineModule)
        }, {
            path: 'settings',
            loadChildren: () => import('./settings/settings.module').then(m => m.SettingsModule)
        }, {
            path: 'chat',
            loadChildren: () => import('./chats/chats.module').then(m => m.ChatsModule)
        },  {
            path: 'automation',
            loadChildren: () => import('./automations/automations.module').then(m => m.AutomationsModule)
        }
        
    ]
}];

@NgModule({
    imports: [
        SharedModule, ChartsModule, ClickOutsideModule, CommonModule, RouterModule.forChild(routes)
    ],
    exports: [],
    declarations: [
        SplitwordPipe, InternalComponent, TopNavBarComponent, SideBarComponent, FooterComponent
    ]
})
export class InternalModule {
}
