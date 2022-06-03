import {NgModule} from '@angular/core';
import {SharedModule} from '../../shared/modules/shared.module';
import {ChartsModule} from 'ng2-charts';
import {CKEditorModule} from 'ng2-ckeditor';
import {ContactsComponent} from './contacts.component';
import {RouterModule, Routes} from '@angular/router';
import {AuthGuardService as AuthGuard} from '../../services/authguard.service';
import {ManageTagComponent} from './manage-tag/manage-tag.component';

const routes: Routes = [
    {
        path: '', children: [
            {
                path: '',
                component: ContactsComponent,
                data: {title: 'Contacts'},
                canActivate: [AuthGuard],
            }, {
                path: 'manage-tag/:id',
                component: ManageTagComponent,
                data: {title: 'Manage Tag'},
                canActivate: [AuthGuard],
            }, {
                path: 'tag-settings',
                component: ManageTagComponent,
                data: {title: 'Manage Tag'},
                canActivate: [AuthGuard],
            }
        ]
    }
];

@NgModule({
    imports: [
        SharedModule,
        ChartsModule,
        CKEditorModule,
        RouterModule.forChild(routes),
    ],
    declarations: [
        ContactsComponent,
        ManageTagComponent
    ],
})
export class ContactsModule {
}
