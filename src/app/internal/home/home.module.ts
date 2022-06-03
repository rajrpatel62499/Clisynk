import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {Routes, RouterModule} from '@angular/router';
import {HomeComponent} from './home.component';
import {SharedModule} from '../../shared/modules/shared.module';
import {AuthGuardService} from '../../services/authguard.service';

const routes: Routes = [
    {
        path: '', children: [
            {
                path: '',
                component: HomeComponent,
                canActivate: [AuthGuardService],
                data: {title: 'Home'},
            }
        ]
    }
];

@NgModule({
    declarations: [
        HomeComponent
    ],
    imports: [
        CommonModule,
        RouterModule.forChild(routes),
        SharedModule
    ]
})
export class HomeModule {
}
