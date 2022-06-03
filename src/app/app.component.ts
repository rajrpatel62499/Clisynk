import {Component, HostListener, NgZone, OnDestroy, OnInit} from '@angular/core';
import {Title} from '@angular/platform-browser';
import {SwUpdate} from '@angular/service-worker';
import {filter, map} from 'rxjs/operators';
import {ActivatedRoute, NavigationEnd, Router} from '@angular/router';
import {PlatformLocation} from '@angular/common';
import {Location} from '@angular/common';
import {HttpService} from './services/http.service';
import {Subscription} from 'rxjs';
import 'rxjs-compat/add/operator/filter';
import 'rxjs-compat/add/operator/map';
import {smoothlyMenu} from './app.helpers';
import {AclService} from './services/acl.service';
import {MessagingService} from './shared/messaging.service';

declare var jQuery: any;

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html'
})
export class AppComponent implements OnInit, OnDestroy {
    message: any;
    subscription: Subscription;
    loading = true;
    title = 'Clisynk';

    constructor(private http: HttpService, private swUpdate: SwUpdate, public acl: AclService,
                private zone: NgZone, location: PlatformLocation, public router: Router,
                private _location: Location, private titleService: Title, public messagingService: MessagingService
    ) {
        location.onPopState(() => {
            this.zone.run(() => {
                const url = this.getUrl();
                this.http.navigate(url);
            });
        });

    }

    toggleNavigation(): void {
        jQuery('body').toggleClass('mini-navbar ');
        smoothlyMenu();
    }

    ngOnInit() {
        if (this.swUpdate.isEnabled) {
            this.swUpdate.available.subscribe(() => {
                if (confirm('New version available. Load New Version?')) {
                    window.location.reload();
                }
            });
        }
        this.router.events.filter((event) => event instanceof NavigationEnd).map(() => this.router).subscribe((event) => {
                    const title = this.getTitle(this.router.routerState, this.router.routerState.root).join(' | ');
                    this.titleService.setTitle(title);
                    this.http.changeTitle(title);
                    this.acl.validRoute(this.router.routerState, this.router);
                }
        );
        const userId = 'user001';
        this.messagingService.requestPermission(userId);
        this.messagingService.receiveMessage();
        this.message = this.messagingService.currentMessage;
    }

    getTitle(state, parent) {
        const data = [];
        if (parent && parent.snapshot.data && parent.snapshot.data.title) {
            data.push(parent.snapshot.data.title);
        }
        if (state && parent) {
            data.push(...this.getTitle(state, state.firstChild(parent)));
        }
        return data;
    }

    getUrl() {
        const len = this._location.path().indexOf(';');
        let str = this._location.path();
        if (len !== -1) {
            str = (this._location.path().slice(0, (len)));
        }
        return str;
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
    }

}
