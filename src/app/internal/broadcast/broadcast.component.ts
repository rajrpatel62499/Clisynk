import { BroadCastType } from './../../models/enums';
import {Component, OnInit} from '@angular/core';
import { FormControl} from '@angular/forms';
import {HttpService} from '../../services/http.service';
import {ApiUrl} from '../../services/apiUrls';
import {TableModel} from '../../shared/models/table.common.model';
import {DeleteComponent} from '../../shared/modals/delete/delete.component';
import {Subject} from 'rxjs';

@Component({
    selector: 'app-broadcast',
    templateUrl: './broadcast.component.html',
    styleUrls: ['./broadcast.component.scss']
})

export class BroadcastComponent implements OnInit {

    broadCastType = BroadCastType;
    
    myModel: TableModel;
    search = new FormControl();

    constructor(public http: HttpService) {
        this.myModel = new TableModel();
        this.http.clearSavedData();
    }

    ngOnInit() {
        this.broadcastList(0);
    }

    broadcastList(status) {
        const obj: any = {
            filter: status,
            search: this.search.value
        };
        this.myModel.loader = true;
        this.myModel.data = null;
        this.http.getData(ApiUrl.BROADCAST_LIST, obj).subscribe(res => {
            this.myModel.data = res.data;
            this.myModel.loader = false;
        });
    }

    copyBroadcast(data) {
        this.http.postData(ApiUrl.COPY_BROADCAST, {broadcastId: data._id}).subscribe(res => {
            this.broadcastList(0);
            this.http.saveData(res.data);
            this.http.openSnackBar('Copied Successfully');
            this.http.navigate('/broadcast/edit-broadcast', res.data._id);
        });
    }

    deleteBroadcast(data) {
        const obj: any = {
            type: 10,
            key: 'id',
            title: `Really delete?`,
            message: 'Do you really want to delete this draft?',
            id: data._id
        };

        const modalRef = this.http.showModal(DeleteComponent, 'xs', obj);
        modalRef.content.onClose = new Subject<boolean>();
        modalRef.content.onClose.subscribe(() => {
            this.broadcastList(0);
            this.http.openSnackBar('Broadcast has been deleted');
        });
    }

    openDetails(data,fullView = true) {
        // const obj: any = {
        //     content: data.content
        // };
        this.http.openModal('emailDetail', {content: data.content, subject: data.subject, fullView});
    }

}
