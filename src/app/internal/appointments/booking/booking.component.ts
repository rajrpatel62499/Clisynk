import {Component, OnInit} from '@angular/core';
import {FormGroup} from '@angular/forms';
import {HttpService} from '../../../services/http.service';
import {TableModel} from '../../../shared/models/table.common.model';
import {ActivatedRoute} from '@angular/router';

@Component({
    selector: 'app-booking',
    templateUrl: './booking.component.html'
})

export class BookingComponent implements OnInit {

    myModel: any;
    form: FormGroup;
    allData: any = {};

    constructor(public http: HttpService, public activeRoute: ActivatedRoute) {
        this.myModel = new TableModel();
    }

    ngOnInit() {
        const routeParams = this.activeRoute.snapshot.params;
        this.allData.name = routeParams.name;
        this.activeRoute.queryParams.subscribe(params => {
            this.allData.bookingId = params['bookingId'];
        });
    }

}
