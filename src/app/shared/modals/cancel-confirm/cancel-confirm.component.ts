import {Component} from '@angular/core';
import {HttpService} from '../../../services/http.service';
import {Subject} from 'rxjs';

@Component({
    selector: 'app-cancel-confirm',
    templateUrl: './cancel-confirm.component.html',
    styleUrls: ['./cancel-confirm.component.scss']
})
export class CancelConfirmComponent {

    public onClose: Subject<boolean>;

    constructor(public http: HttpService) {
    }

    closeMainPopup() {
        this.http.hideModal();
        this.onClose.next(true);
    }

}
