import {Component} from '@angular/core';
import {HttpService} from '../../../services/http.service';
import {Subject} from 'rxjs';

@Component({
    selector: 'app-confirm',
    templateUrl: './confirm.component.html'
})
export class ConfirmComponent {

    modalData: any;
    public onClose: Subject<boolean>;

    constructor(public http: HttpService) {
    }

}
