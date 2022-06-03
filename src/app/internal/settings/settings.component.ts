import {Component, OnInit} from '@angular/core';
import {TableModel} from '../../shared/models/table.common.model';
import {HttpService} from '../../services/http.service';
import {ApiUrl} from '../../services/apiUrls';

@Component({
    selector: 'app-settings',
    templateUrl: './settings.component.html'
})

export class SettingsComponent implements OnInit {

    myModel: any;

    constructor(public http: HttpService) {
        this.myModel = new TableModel();
    }

    ngOnInit() {
    }



}
