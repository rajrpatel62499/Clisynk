import {Component, OnInit} from '@angular/core';
import {HttpService} from '../../../services/http.service';

@Component({
    selector: 'app-contact-details',
    templateUrl: './contact-details.component.html',
})
export class ContactDetailsComponent implements OnInit {

    modalData: any;
    loginData: any;

    constructor(
        public http: HttpService,
    ) {
    }

    ngOnInit(): void {
    }

    closeFun() {
        this.http.hideModal();
    }
}
