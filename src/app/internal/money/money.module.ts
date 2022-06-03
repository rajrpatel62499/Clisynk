import {NgModule} from '@angular/core';
import {SharedModule} from '../../shared/modules/shared.module';
import {MoneyComponent} from './money.component';
import {RouterModule, Routes} from '@angular/router';
import {AuthGuardService as AuthGuard} from '../../services/authguard.service';

const routes: Routes = [
    {
        path: '', children: [
            {
                path: '',
                component: MoneyComponent,
                data: {title: 'Money'},
                canActivate: [AuthGuard]
            }
        ]
    }
];

@NgModule({
    imports: [
        SharedModule,
        RouterModule.forChild(routes)
    ],
    declarations: [
        MoneyComponent
    ]
})
export class MoneyModule {
}
