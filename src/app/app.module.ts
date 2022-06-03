import {BrowserModule, Title} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {NgxEmojiPickerModule} from 'ngx-emoji-picker';
import {AppComponent} from './app.component';
import {LoginComponent} from './external/login/login.component';
import {ExportToExcelService} from './services/exportToExcel.service';
import {SharedModule} from './shared/modules/shared.module';
import {CapitalizePipe} from './shared/pipes/capitalizefirst.pipe';
import {AppRoutingModule} from './app-routing.module';
import {HttpClientModule, HTTP_INTERCEPTORS} from '@angular/common/http';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {ToastrModule} from 'ngx-toastr';
import {ServiceWorkerModule} from '@angular/service-worker';
import {environment} from '../environments/environment';
import {InterceptorService} from './services/interceptor.service';
import {LightboxModule} from 'ngx-lightbox';
import {AsyncPipe} from '@angular/common';
import {PrivacyComponent} from './external/privacy/privacy.component';
import {ExternalAuthguardService} from './services/externalAuthguard.service';
// import {ForgotPasswordComponent} from './shared/modals/forgot-password/forgot-password.component';
import {ReceiptComponent} from './external/receipt/receipt.component';
import {BookingComponent} from './internal/appointments/booking/booking.component';
import {ShoppingReducer} from './internal/actions/reducer';
import {StoreModule} from '@ngrx/store';
import {TodoComponent} from './internal/actions/todo/todo.component';
import { SimpleTimer } from 'ng2-simple-timer';

import {TwilioService} from './services/twilio.service';
import {NgxDocViewerModule} from 'ngx-doc-viewer';
import { PushNotificationsModule } from 'ng-push';

// firebase
import { AngularFireMessagingModule } from '@angular/fire/messaging';
import { AngularFireModule } from '@angular/fire';
// import { BuildAutomationComponent } from './internal/automations/build-automation/build-automation.component';
// import { AddBuildautomationComponent } from './internal/automations/add-buildautomation/add-buildautomation.component';
// import { BuildThenautomationsComponent } from './internal/automations/build-thenautomations/build-thenautomations.component';
import { SubmitfeedbackComponent } from './shared/modals/submitfeedback/submitfeedback.component';
import { MatChipsModule } from '@angular/material';
import { PreviewLeadformComponent } from './internal/settings/preview-leadform/preview-leadform.component';
import { PreviewSmartformComponent } from './internal/settings/preview-smartform/preview-smartform.component';
import { ForgotPasswordComponent } from './external/forgot-password/forgot-password.component';

import { NgxSummernoteModule } from 'ngx-summernote';

import {
  NgxUiLoaderModule,
  NgxUiLoaderConfig,
  SPINNER,
  POSITION,
  PB_DIRECTION,
  NgxUiLoaderRouterModule,
  NgxUiLoaderHttpModule
} from 'ngx-ui-loader';
import { CreateAccountsComponent } from './external/create-accounts/create-accounts.component';
import { ValidationMessageComponent } from './shared/components/validation-message/validation-message.component';
import { ThanksPageComponent } from './external/thanks-page/thanks-page.component';



const ngxUiLoaderConfig: NgxUiLoaderConfig = {
  bgsColor: '#87cefa',
  fgsColor: '#87cefa',
  pbColor: '#87cefa'
};

@NgModule({
    declarations: [
        CapitalizePipe, AppComponent, LoginComponent, PrivacyComponent, SubmitfeedbackComponent,
        ReceiptComponent, BookingComponent, TodoComponent, 
        // BuildAutomationComponent, AddBuildautomationComponent, BuildThenautomationsComponent,
         PreviewLeadformComponent, PreviewSmartformComponent,
        ForgotPasswordComponent,
        CreateAccountsComponent,
        ValidationMessageComponent,
        ThanksPageComponent
        
        
    ],
    imports: [
        SharedModule, BrowserModule, AppRoutingModule, HttpClientModule,NgxEmojiPickerModule,NgxDocViewerModule,
        PushNotificationsModule,ServiceWorkerModule.register('/ngsw-worker.js', {
            enabled: environment.production
        }),
        StoreModule.forRoot({shopping: ShoppingReducer}),
        CommonModule, BrowserAnimationsModule,
        ToastrModule.forRoot({
            closeButton: true,
            timeOut: 3000,
            progressAnimation: 'increasing',
            preventDuplicates: true,
            resetTimeoutOnDuplicate: true,
            progressBar: true
        }),
        LightboxModule,
        AngularFireMessagingModule,
        MatChipsModule,
        AngularFireModule.initializeApp(environment.firebase),
        NgxSummernoteModule,
        NgxUiLoaderModule.forRoot(ngxUiLoaderConfig),
        NgxUiLoaderRouterModule, // import this module for showing loader automatically when navigating between app routes
        NgxUiLoaderHttpModule
    ],

    providers: [
        {
            provide: HTTP_INTERCEPTORS,
            useClass: InterceptorService,
            multi: true
        },
        AsyncPipe, ExternalAuthguardService, ExportToExcelService, Title,TwilioService,SimpleTimer  
    ],
    bootstrap: [AppComponent],
    exports: [CapitalizePipe],
    entryComponents: [ForgotPasswordComponent, SubmitfeedbackComponent]
    // HttpService,
})

export class AppModule {
}
