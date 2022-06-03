import {AfterViewInit, Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import 'jquery-slimscroll';
import {HttpService} from '../../services/http.service';
import {smoothlyMenu} from '../../app.helpers';
import {AclService} from '../../services/acl.service';

declare var jQuery: any;

@Component({
    selector: 'app-side-bar',
    templateUrl: 'sideBar.component.html',
    styleUrls: ['sideBar.component.css']
})

export class SideBarComponent implements OnInit, AfterViewInit {

    sideBar: any;
    childBar: any = [];

    constructor(private router: Router, public http: HttpService, public acl: AclService) {
        jQuery(document).ready(function () {
            jQuery('#sidebarCollapse').on('click', function () {
                console.log('in toggle')
                jQuery('#sidebar').toggleClass('active');
            });
        });
    }

    ngOnInit(): void {
        this.acl.setSideBar();
        this.sideBar = this.acl.sideBar;
        console.log(this.sideBar);
    }

    ngAfterViewInit() {
        jQuery('#side-menu').metisMenu();
        if (jQuery('body').hasClass('fixed-sidebar')) {
            jQuery('.sidebar-collapse').slimscroll({
                height: '100%'
            });
        }
    }

    activeRoute(routename: string): boolean {
        return this.router.url.indexOf(routename) > -1;
    }

    toggleNavigation(): void {
        console.log('in toggle')
        jQuery('body').toggleClass('mini-navbar ');
        smoothlyMenu();
    }

    hideSideBar() {
        console.log('in toggle')
        if (jQuery(document).width() < 769) {
            this.toggleNavigation();
        }
    }

    onClickedOutside(e: Event) {
        if (jQuery(document).width() < 769) {
            // jQuery('body').addClass('body-small')
            this.toggleNavigation();
        }
        jQuery('body').toggleClass('mini-navbar ');
    }

}
