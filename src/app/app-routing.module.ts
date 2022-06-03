import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {LoginComponent} from './external/login/login.component';
import {PrivacyComponent} from './external/privacy/privacy.component';
import {ExternalAuthguardService} from './services/externalAuthguard.service';
import {ReceiptComponent} from './external/receipt/receipt.component';
import {BookingComponent} from './internal/appointments/booking/booking.component';
import {TodoComponent} from './internal/actions/todo/todo.component';
// import { BuildAutomationComponent } from './internal/automations/build-automation/build-automation.component';
// import { AddBuildautomationComponent } from './internal/automations/add-buildautomation/add-buildautomation.component';
// import { BuildThenautomationsComponent } from './internal/automations/build-thenautomations/build-thenautomations.component';
import { PreviewLeadformComponent } from './internal/settings/preview-leadform/preview-leadform.component';
import { PreviewSmartformComponent } from './internal/settings/preview-smartform/preview-smartform.component';
import { ForgotPasswordComponent } from './external/forgot-password/forgot-password.component';
import { CreateAccountsComponent } from './external/create-accounts/create-accounts.component';
import { ThanksPageComponent } from './external/thanks-page/thanks-page.component';


const routes: Routes = [
    {path: '', redirectTo: '/login', pathMatch: 'full'},
    {path: 'login', component: LoginComponent, canActivate: [ExternalAuthguardService]},
    {path: 'forgotpassword', component: ForgotPasswordComponent},
    {path: 'createaccount', component: CreateAccountsComponent},
    {path: 'thankspage', component:ThanksPageComponent},
    {path: 'privacy', component: PrivacyComponent},
    {path: 'receipt', component: ReceiptComponent},
    {path: 'ngrx', component: TodoComponent},
    // {path: 'build-automation', component: BuildAutomationComponent},
    // {path: 'add-build-automation', component: AddBuildautomationComponent},
    // {path: 'build-automation-then', component: BuildThenautomationsComponent},
    {path: 'booking/:name', component: BookingComponent},
    {path: 'preview-leadform/:id', component: PreviewLeadformComponent},
    {path: 'preview-smartform/:id', component: PreviewSmartformComponent},
    {path: '', loadChildren: () => import('./internal/internal.module').then(m => m.InternalModule)}
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})

export class AppRoutingModule {
}
