import {NgModule} from '@angular/core';
import { CodemirrorModule } from '@ctrl/ngx-codemirror';
import {SharedModule} from '../../shared/modules/shared.module';
import {RouterModule, Routes} from '@angular/router';
import {AuthGuardService as AuthGuard} from '../../services/authguard.service';
import {BroadcastComponent} from './broadcast.component';
import {AddBroadcastComponent} from './add-broadcast/add-broadcast.component';
import { CustomMailComponent } from './add-broadcast/custom-mail/custom-mail.component';
import { CodeYourOwnComponent } from './add-broadcast/code-your-own/code-your-own.component';
import { ChooseThemeComponent } from './add-broadcast/choose-theme/choose-theme.component';
import { EditCodeComponent } from './edit-code/edit-code.component';
import { DynamicHTMLModule } from './edit-code/dynamic-html';
import { NewEmailBroadcastComponent } from './new-email-broadcast/new-email-broadcast.component';

const routes: Routes = [
    {
        path: '', children: [
            {
                path: '',
                component: BroadcastComponent,
                data: {title: 'BroadCast'},
                canActivate: [AuthGuard]
            },
            {
                path: 'add-broadcast',
                component: AddBroadcastComponent,
                data: {title: 'Add BroadCast'},
                canActivate: [AuthGuard]
            },
            {
                path: 'edit-broadcast/:id',
                component: AddBroadcastComponent,
                data: {title: 'Edit BroadCast'},
                canActivate: [AuthGuard]
            },
            // {
            //     path: 'edit-code',
            //     component: EditCodeComponent,
            //     data: {title: 'Edit Code'},
            // }
            {
                path: 'edit-code',
                component: EditCodeComponent,
                data: {title: 'Edit Code'},
            },
            {
                path: 'send-email-broadcast',
                component:NewEmailBroadcastComponent,
                data: {title: 'New Email Broadcast'},
            }
        ]
    }
];

@NgModule({
    imports: [
        SharedModule,
        CodemirrorModule,
        RouterModule.forChild(routes),
      
    ],
    declarations: [
        BroadcastComponent,
        AddBroadcastComponent,
        CustomMailComponent,
        CodeYourOwnComponent,
        ChooseThemeComponent,
        EditCodeComponent,
        NewEmailBroadcastComponent
    ]
})
export class BroadcastModule {
}
