import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {HttpService} from '../../../services/http.service';
import {ApiUrl} from '../../../services/apiUrls';
import {Subject} from 'rxjs';

@Component({
    selector: 'app-delete',
    templateUrl: './delete.component.html'
})
export class DeleteComponent implements OnInit {

    modalData: any;
    public onClose: Subject<boolean>;

    constructor(public http: HttpService) {
    }

    ngOnInit(): void {
    }

    deleteFun() {
        if (this.modalData.id) {
            const obj: any = {
                [this.modalData.key]: this.modalData.id,
                type: this.modalData.type
            };
            this.http.hideModal();
            this.http.postData(ApiUrl.DELETE_DATA, obj, false)
                .subscribe(() => {
                    this.onClose.next(true);
                    this.http.contactUpdated();
                }, () => {
                });

        } else {
            this.onClose.next(true);
        }
    }
}
