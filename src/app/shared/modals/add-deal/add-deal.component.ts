import {Component, OnInit} from '@angular/core';
import {FormGroup, Validators} from '@angular/forms';
import {HttpService} from '../../../services/http.service';
import {TableModel} from '../../models/table.common.model';
import {ApiUrl} from '../../../services/apiUrls';
import {Subject} from 'rxjs';

@Component({
    selector: 'app-add-deal',
    templateUrl: './add-deal.component.html'
})
export class AddDealComponent implements OnInit {

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
        itemsShowLimit: 2,
        allowSearchFilter: true,
        'disabled': true,
        'closeDropDownOnSelection': true
    };

    constructor(public http: HttpService) {
        this.myModel = new TableModel();
    }

    ngOnInit(): void {
        this.formInit();
        this.contactList();
    }

    finalSubmit() {
        const obj: any = JSON.parse(JSON.stringify(this.form.value));

        if (this.form.value.contactId.length) {
            obj.contactId = JSON.stringify(this.http.getIdsOnly(this.form.value.contactId));
        }

        if (this.isEdit) {
            obj.taskId = this.modalData._id;
        }
        if (this.http.isFormValid(this.form)) {
            this.http.hideModal();
            this.http.postData(ApiUrl.ADD_DEAL, obj).subscribe(() => {
                if (this.isEdit) {
                    this.http.openSnackBar('Deal Updated Successfully');
                } else {
                    this.http.openSnackBar('Deal Added Successfully');
                }
                this.http.eventSubject.next({eventType: 'addDeal'});
            }, () => {
            });
        }
    }

    contactList(search?) {
        this.isSelected = false;
        const obj: any = {
            skip: 0,
            limit: 100,
            search: search ? search : ''
        };
        this.http.getData(ApiUrl.CONTACTS, obj).subscribe(res => {
                    res.data.data.forEach((val) => {
                        this.http.checkLastName(val);
                        if (this.isEdit) {
                            if (this.modalData.contactId && this.modalData.contactId._id === val._id) {
                                this.form.controls.contactId.patchValue([val]);
                            }
                        }
                    });
                    this.myModel.contacts = res.data.data;
                },
                () => {
                });
    }

    formInit() {
        this.form = this.http.fb.group({
            contactId: ['', Validators.required],
            notes: [''],
            name: ['', Validators.required],
            dealValue: [undefined, Validators.required],
            stageId: [this.modalData._id],
            pipelineId: [this.modalData.pipelineId]
        });
    }

    changeStatus(status) {
        const obj = {
            status: status,
            taskId: this.modalData._id
        };
        this.http.hideModal();
        this.http.getData(ApiUrl.UPDATE_TASK, obj).subscribe(() => {
            if (status === 2) {
                this.http.openSnackBar('Deal Completed Successfully');
            } else {
                this.http.openSnackBar('Deal Deleted Successfully');
            }
            this.http.eventSubject.next({eventType: 'addDeal'});
        });
    }

}
