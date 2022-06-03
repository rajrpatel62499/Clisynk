import {Injectable} from '@angular/core';
import {Router, CanActivate, CanDeactivate} from '@angular/router';
import {Observable} from 'rxjs';
import {AclService} from './acl.service';

export interface CanComponentDeactivate {
    canDeactivate: () => Observable<boolean> | Promise<boolean> | boolean;
}

@Injectable()
export class ExternalAuthguardService implements CanActivate, CanDeactivate<CanComponentDeactivate> {
    constructor(public router: Router, public acl: AclService) {
    }

    canActivate(): boolean {
        if (!this.isAuthenticated()) {
            return true;
        } else {
            this.router.navigate(['/home']);
            return false;
        }
    }

    canDeactivate(component: CanComponentDeactivate) {
        return component.canDeactivate ? component.canDeactivate() : true;
    }

    isAuthenticated(): boolean {
        const token = localStorage.getItem('accessToken');
        return !!token;
    }

}
