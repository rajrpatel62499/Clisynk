import {AfterViewInit, Component, OnDestroy} from '@angular/core';

declare var jQuery: any;

@Component({
    selector: 'app-blank-layout',
    templateUrl: 'blankLayout.html'
})
export class BlankLayoutComponent implements AfterViewInit, OnDestroy {

    ngAfterViewInit() {
        jQuery('body').addClass('gray-bg');
    }

    ngOnDestroy() {
        jQuery('body').removeClass('gray-bg');
    }
}
