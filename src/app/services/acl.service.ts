import {Injectable} from '@angular/core';
import {HttpService} from './http.service';
import {sideBarAdmin} from './constants';
import {ActivatedRoute} from '@angular/router';

@Injectable({
    providedIn: 'root'
})
export class AclService {

    loginData: any = {};
    sideBar: any = [];

    constructor(public http: HttpService, public activatedRoute: ActivatedRoute) {
        this.loginData = this.http.getLoginData();
    }

    setSideBar() {
        this.loginData = this.http.getLoginData();
        if (this.loginData) {
            if (this.loginData.superAdmin) {
                this.sideBar = sideBarAdmin;
            } else {
                this.setSideBarSubAdmin();
            }
        }
    }

    goToFirst() {
        this.loginData = this.http.getLoginData();
        if (this.loginData) {
            if (this.loginData.superAdmin) {
                this.http.navigate('home');
                this.sideBar = sideBarAdmin;
            }
            if (this.loginData.roles) {
                this.http.navigate(this.loginData.roles[0]);
            }
        } else {
            this.http.navigate('login');
        }
    }

    setSideBarSubAdmin() {
        const tempArr: any = [];
        sideBarAdmin.forEach((val) => {
            this.loginData.roles.forEach((val1) => {
                if (val.path === val1) {
                    tempArr.push(val);
                }
            });
        });
        this.sideBar = tempArr;
    }

    getSubUserRoles(subUser:User) {
        const tempArr: any = [];
        sideBarAdmin.forEach((val) => {
            subUser.roles.forEach((val1) => {
                if (val.path === val1) {
                    tempArr.push(val);
                }
            });
        });
        return tempArr;
    }

    validRoute(state, parent) {
        this.loginData = this.http.getLoginData();
        if (!this.loginData.superAdmin) {
            if (state.snapshot.url) {
                this.routeExist(state.snapshot.url);
            }
        }
    }

    routeExist(url) {

        let splitUrl = url.split('?');
        if (splitUrl[0].includes('/')) {
            splitUrl = splitUrl[0].split('/');
            splitUrl[0] = '/' + splitUrl[1];
        }
        this.loginData = this.http.getLoginData();
        // local test
        if (!this.loginData.roles.includes(splitUrl[0] ? splitUrl[0] : url)) {
            this.http.navigate(this.loginData.roles[0]);
            return false;
        } else {
            return true;
        }
    }

}
