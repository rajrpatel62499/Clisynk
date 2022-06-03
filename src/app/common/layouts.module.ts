import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {RouterModule} from '@angular/router';
import {BlankLayoutComponent} from './layouts/blankLayout.component';
import {ClickOutsideModule} from 'ng-click-outside';

@NgModule({
    declarations: [
        BlankLayoutComponent,
    ],
    imports: [
        BrowserModule,
        ClickOutsideModule,
        RouterModule,
    ],
    exports: [
        BlankLayoutComponent,
    ],
})

export class LayoutsModule {
}
