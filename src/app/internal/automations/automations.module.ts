import { DisplayCardComponent } from './build-automation/build-automation-main/display-card/display-card.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { SharedModule } from '../../shared/modules/shared.module';
import { AuthGuardService } from '../../services/authguard.service';
import { AutomationComponent } from './automation.component';
import { MatExpansionModule, MatChipsModule } from '@angular/material';
import { BuildAutomationComponent } from './build-automation/build-automation.component';
import { AddBuildautomationComponent } from './add-buildautomation/add-buildautomation.component';
import { BuildThenautomationsComponent } from './build-thenautomations/build-thenautomations.component';
import { FreeConsulationComponent } from './free-consulation/free-consulation.component';
import { FreeConsultaionThen } from './choose-tag/choose-tag.component';
import { MatMenuModule } from '@angular/material/menu';
import { FreeCosulationWhenComponent } from './free-cosulation-when/free-cosulation-when.component';
import { BuildAutomationMainComponent } from './build-automation/build-automation-main/build-automation-main.component';
import { AutomationPreviewComponent } from './build-automation/build-automation-main/automation-preview/automation-preview.component';
import { ThenSuggestionsComponent } from './build-automation/build-automation-main/then-suggestions/then-suggestions.component';
import { WhenSuggestionsComponent } from './build-automation/build-automation-main/when-suggestions/when-suggestions.component';
import { AutomationHeaderComponent } from './build-automation/build-automation-main/automation-header/automation-header.component';
import { ChooseLeadFormComponent } from './build-automation/build-automation-main/edit/when/choose-lead-form/choose-lead-form.component';
import { ChooseAppointmentTypeComponent } from './build-automation/build-automation-main/edit/when/choose-appointment-type/choose-appointment-type.component';
import { LoadingComponent } from './loading/loading.component';
import { ChooseTagComponent } from './build-automation/build-automation-main/edit/when/choose-tag/choose-tag.component';
import { ChooseProductComponent } from './build-automation/build-automation-main/edit/when/choose-product/choose-product.component';
import { ChooseTemplateComponent } from './build-automation/build-automation-main/edit/then/choose-template/choose-template.component';
import { EmailEditorComponent } from './build-automation/build-automation-main/edit/then/choose-template/email-editor/email-editor.component';
import { SendNotificationComponent } from './build-automation/build-automation-main/edit/then/send-notification/send-notification.component';
import { TimeScheduleComponent } from './build-automation/build-automation-main/edit/then/time-schedule/time-schedule.component';
import { ThenTimePipe } from './build-automation/build-automation-main/display-card/then-time.pipe';

// import { AmazingTimePickerModule } from 'amazing-time-picker';

const routes: Routes = [
    {
        path: '', children: [
            { path: '', component: AutomationComponent, canActivate: [AuthGuardService], data: { title: 'Automation' } },
            { path: 'build-automation', component: BuildAutomationComponent, canActivate: [AuthGuardService], data: { title: 'Automation' } },
            { path: 'build-automation-main', component: BuildAutomationMainComponent, canActivate: [AuthGuardService], data: { title: 'Automation' } },
            { path: 'build-automation-when', component: AddBuildautomationComponent, canActivate: [AuthGuardService], data: { title: 'Automation' } },
            { path: 'build-automation-then', component: BuildThenautomationsComponent, canActivate: [AuthGuardService], data: { title: 'Automation' } },

            { path: 'free-consulation', component: FreeConsulationComponent, canActivate: [AuthGuardService], data: { title: 'Automation' } },
            { path: 'free-consulation-then', component: FreeConsultaionThen, canActivate: [AuthGuardService], data: { title: 'Automation' } },
            { path: 'free-consulation-when', component: FreeCosulationWhenComponent, canActivate: [AuthGuardService], data: { title: 'Automation' } },
        ]
    }
];


@NgModule({
    declarations: [
        AutomationComponent, BuildAutomationComponent, AddBuildautomationComponent, BuildThenautomationsComponent,
        FreeConsulationComponent, FreeConsultaionThen, FreeCosulationWhenComponent, BuildAutomationMainComponent, AutomationPreviewComponent
        ,DisplayCardComponent, ThenSuggestionsComponent, WhenSuggestionsComponent, AutomationHeaderComponent, 
        ChooseLeadFormComponent, ChooseAppointmentTypeComponent, LoadingComponent, ChooseTagComponent, ChooseProductComponent, ChooseTemplateComponent, EmailEditorComponent, SendNotificationComponent, TimeScheduleComponent, ThenTimePipe

    ],
    imports: [
        CommonModule,
        RouterModule.forChild(routes),
        SharedModule,
        MatMenuModule,
        MatExpansionModule,
        //   AmazingTimePickerModule,
        MatChipsModule
    ],

})
export class AutomationsModule { }
