import {Component, Input, OnChanges, OnInit} from '@angular/core';
import {HttpService} from '../../../services/http.service';
import {TableModel} from '../../models/table.common.model';

@Component({
    selector: 'app-book-modal',
    templateUrl: './book-modal.component.html'
})
export class BookModalComponent implements OnInit, OnChanges {

    @Input() allData: any;
    myModel: any;
    modalData: any;

    constructor(public http: HttpService) {
        this.myModel = new TableModel();
    }

    ngOnInit(): void {
    }

    ngOnChanges() {
    }

    finalSubmit() {

    }

}
