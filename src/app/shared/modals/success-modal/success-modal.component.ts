import {Component, OnInit} from '@angular/core';
import {HttpService} from '../../../services/http.service';

@Component({
    selector: 'app-success-modal',
    templateUrl: './success-modal.component.html'
})
export class SuccessModalComponent implements OnInit {

    modalData: any;

    constructor(public http: HttpService) {
    }

    ngOnInit(): void {
    }

    finalSubmit() {
        this.http.hideModal();
    }

}
