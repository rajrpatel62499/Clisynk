import {Injectable} from '@angular/core';
import {Router, CanActivate, CanDeactivate, ActivatedRoute, NavigationEnd} from '@angular/router';
import {Observable} from 'rxjs';
import {AclService} from './acl.service';

import 'rxjs-compat/add/operator/filter';
import 'rxjs-compat/add/operator/map';

export interface CanComponentDeactivate {
    canDeactivate: () => Observable<boolean> | Promise<boolean> | boolean;
}

@Injectable({
    providedIn: 'root'
})
export class AuthGuardService implements CanActivate, CanDeactivate<CanComponentDeactivate> {
    constructor(public router: Router) {
    }

    canActivate(): boolean {
        if (!this.isAuthenticated()) {
            this.router.navigate(['/login']);
            return false;
        }
        return true;
    }

    canDeactivate(component: CanComponentDeactivate) {
        return component.canDeactivate ? component.canDeactivate() : true;
    }

    isAuthenticated(): boolean {
        const token = localStorage.getItem('accessToken');
        return !!token;
    }
}
