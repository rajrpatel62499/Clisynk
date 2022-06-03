import {Component, Input} from '@angular/core';
import {HttpService} from '../../../services/http.service';

@Component({
    selector: 'app-activity-list',
    templateUrl: './activity-list.component.html'
})
export class ActivityListComponent {

    @Input() allData: any;

    constructor(public http: HttpService) {
    }

}
