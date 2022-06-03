import {Component, OnInit, Input} from '@angular/core';
import {HttpService} from '../../../services/http.service';
import {AppointmentService} from '../../../internal/appointments/appointment.service';

@Component({
    selector: 'app-appoint-4',
    templateUrl: './appoint-step4.component.html'
})
export class AppointStep4Component implements OnInit {

    @Input() inputData: any;

    constructor(public http: HttpService, public appoint: AppointmentService) {
    }

    ngOnInit(): void {
    }

}
