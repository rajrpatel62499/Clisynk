import {Component, OnInit} from '@angular/core';
import {TableModel} from '../../models/table.common.model';
import {HttpService} from '../../../services/http.service';
import {ApiUrl} from '../../../services/apiUrls';

@Component({
    selector: 'app-import-contact',
    templateUrl: './import-contact.component.html',
})
export class ImportContactComponent implements OnInit {

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

    uploadImage(file) {
        this.http.hideModal();
        this.http.uploadFile(ApiUrl.IMPORT_CONTACT, file, false)
            .subscribe(() => {
                this.http.contactUpdated();
                this.http.openSnackBar('Contact Imported Successfully');
            }, () => {
            });
    }

    finalSubmit() {
        this.http.hideModal();
    }

}
