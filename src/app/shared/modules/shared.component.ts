import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import 'rxjs-compat/add/operator/filter';
import 'rxjs-compat/add/operator/map';
import {HttpService} from '../../services/http.service';
import {Subscription} from 'rxjs';

@Component({
    selector: 'app-shared',
    template: ''
})
export class SharedComponent implements OnInit {

    myTitle: string;
    subscription: Subscription;

    public constructor(
        public activeRoute: ActivatedRoute, public router: Router, public http: HttpService
    ) {
        this.myTitle = this.activeRoute.firstChild.data['value'].title;
    }

    ngOnInit() {
    }

}
