import {NgModule} from '@angular/core';
import {SharedModule} from '../../shared/modules/shared.module';
import {RouterModule, Routes} from '@angular/router';
import {AuthGuardService as AuthGuard} from '../../services/authguard.service';
import {MyProfileComponent} from './my-profile/my-profile.component';
import {SettingsComponent} from './settings.component';
import {BusinessProfileComponent} from './business-profile/business-profile.component';
import {UsersComponent} from './users/users.component';
import {ProductsComponent} from './products/products.component';
import { LeadFormsComponent } from './lead-forms/lead-forms.component';
import { SmartFormsComponent } from './smart-forms/smart-forms.component';
import { ManageWorkspaceComponent } from './manage-workspace/manage-workspace.component';
import { MatTooltipModule, MatInputModule } from '@angular/material';
// import { EditWorkspaceComponent } from './edit-workspace/edit-workspace.component';
import {MatChipsModule} from '@angular/material/chips';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import { ChangePasswordComponent } from './change-password/change-password.component';

const routes: Routes = [
    {
        path: '', children: [
            {
                path: '',
                component: SettingsComponent,
                data: {title: 'Profile'},
                canActivate: [AuthGuard]
            }, {
                path: 'my-profile',
                component: MyProfileComponent,
                data: {title: 'Profile'},
                canActivate: [AuthGuard]
            }, {
                path: 'business-profile',
                component: BusinessProfileComponent,
                data: {title: 'Business Profile'},
                canActivate: [AuthGuard]
            }, {
                path: 'users',
                component: UsersComponent,
                data: {title: 'Users'},
                canActivate: [AuthGuard]
            }, {
                path: 'products',
                component: ProductsComponent,
                data: {title: 'Products'},
                canActivate: [AuthGuard]
            }, {
                path: 'lead-forms',
                component:LeadFormsComponent,
                data: {title: 'Lead-Forms'},
                canActivate: [AuthGuard]
            },  {
                path: 'smart-forms',
                component:SmartFormsComponent,
                data: {title: 'Smart-Forms'},
                canActivate: [AuthGuard]
            },
            {
                path: 'manage-workspace',
                component:ManageWorkspaceComponent,
                data: {title: 'Manage-Workspace'},
                canActivate: [AuthGuard]
            },
            {
                path: 'change-password',
                component: ChangePasswordComponent,
                data: {title: 'change-password'},
                canActivate: [AuthGuard]
            },
            // {
            //     path: 'edit-workspace',
            //     component:EditWorkspaceComponent,
            //     data: {title: 'Edit-Workspace'},
            //     canActivate: [AuthGuard]
            // }
        ]
    }
];

@NgModule({
    imports: [
        SharedModule,
        RouterModule.forChild(routes),
        MatTooltipModule,
        MatChipsModule,
        MatInputModule,
        NgxSkeletonLoaderModule
    ],
    declarations: [
        MyProfileComponent, SettingsComponent, BusinessProfileComponent, 
        UsersComponent, ProductsComponent, LeadFormsComponent, 
        SmartFormsComponent, ManageWorkspaceComponent,
        ChangePasswordComponent 
    ]
})
export class SettingsModule {
}
