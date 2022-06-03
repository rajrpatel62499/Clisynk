import {Component, OnInit} from '@angular/core';
import {FormGroup, Validators} from '@angular/forms';
import {HttpService} from '../../../services/http.service';
import {TableModel} from '../../models/table.common.model';
import {ApiUrl} from '../../../services/apiUrls';
import {Subject} from 'rxjs';

@Component({
    selector: 'app-add-contact-to-deal',
    templateUrl: './add-contact-to-deal.component.html'
})
export class AddContactToDealComponent implements OnInit {

    form: FormGroup;
    allData;
    myModel: any;
    modalData: any;
    public onClose: Subject<boolean>;
    isSelected = false;
    isEdit = false;
    contactSettings: any = {
        idField: '_id',
        textField: 'showName',
        itemsShowLimit: 4,
        allowSearchFilter: true,
        'disabled': true,
        'closeDropDownOnSelection': true
    };

    constructor(public http: HttpService) {
        this.myModel = new TableModel();
    }

    ngOnInit(): void {
        this.formInit();
        this.modalData.deal.contactId.forEach((val) => {
            this.http.checkLastName(val);
        });
        this.contactList();
    }

    finalSubmit() {
        const obj: any = JSON.parse(JSON.stringify(this.form.value));
        if (this.form.value.contactId.length) {
            obj.contactId = JSON.stringify(this.http.getIdsOnly(this.form.value.contactId));
        }
        obj.dealId = this.modalData.deal._id;
        this.myModel.loader = true;
        if (this.http.isFormValid(this.form)) {
            this.http.postData(ApiUrl.ADD_DEAL, obj).subscribe(() => {
                this.http.openSnackBar('Deal Updated Successfully');
                this.goBack();
                this.myModel.loader = true;
            });
        }
    }

    contactList() {
        this.isSelected = false;
        const obj: any = {
            skip: 0,
            limit: 100
        };
        this.http.getData(ApiUrl.CONTACTS, obj).subscribe(res => {
                    res.data.data.forEach((val) => {
                        this.http.checkLastName(val);
                    });
                    this.myModel.contacts = res.data.data;
                    this.form.controls.contactId.patchValue(this.modalData.deal.contactId);
                },
                () => {
                });
    }

    formInit() {
        this.form = this.http.fb.group({
            contactId: ['', Validators.required],
            dealId: [this.modalData._id]
        });
    }

    goBack() {
        this.http.hideModal();
        this.http.openModal('dealDetails', this.modalData);
    }

}
