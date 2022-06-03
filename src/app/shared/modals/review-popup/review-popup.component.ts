import {Component, OnInit} from '@angular/core';
import {TableModel} from '../../models/table.common.model';
import {HttpService} from '../../../services/http.service';

@Component({
    selector: 'app-review-popup',
    templateUrl: './review-popup.component.html',
})
export class ReviewPopupComponent implements OnInit {

    allData;
    myModel: any;
    modalData: any;


    constructor(
        public http: HttpService
    ) {
        this.myModel = new TableModel();
    }

    ngOnInit(): void {
    }


    finalSubmit() {
        this.http.hideModal();
    }

}
