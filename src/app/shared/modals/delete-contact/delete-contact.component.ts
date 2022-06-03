import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {HttpService} from '../../../services/http.service';
import {ApiUrl} from '../../../services/apiUrls';
import {Subject} from 'rxjs';

@Component({
    selector: 'app-delete',
    templateUrl: './delete-contact.component.html'
})
export class DeleteContactComponent implements OnInit {

    modalData: any;
    public onClose: Subject<boolean>;

    constructor(public http: HttpService) {
    }

    ngOnInit(): void {
    }

    deleteFun() {
        console.log('delete data....',this.modalData)
        this.http.hideModal();
        this.modalData.map((data) => {
            if(data.isSelected == true){
                this.http.postData(ApiUrl.DELETE_CHATROOM, { chatRoomId : data._id } , false)
                .subscribe(() => {
                    this.onClose.next(true);
                    this.http.contactUpdatedChat();
                });
            }
        })
      
    }
}
