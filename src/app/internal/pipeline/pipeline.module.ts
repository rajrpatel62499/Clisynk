import {NgModule} from '@angular/core';
import {SharedModule} from '../../shared/modules/shared.module';
import {PipelineComponent} from './pipeline.component';
import {RouterModule, Routes} from '@angular/router';
import {AuthGuardService as AuthGuard} from '../../services/authguard.service';

const routes: Routes = [
    {
        path: '', children: [
            {
                path: '',
                component: PipelineComponent,
                data: {title: 'Pipeline'},
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
        PipelineComponent
    ]
})
export class PipelineModule {
}
