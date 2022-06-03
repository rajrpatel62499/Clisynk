import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {HttpService} from '../../../services/http.service';
import {TableModel} from '../../models/table.common.model';
import {ApiUrl} from '../../../services/apiUrls';
import {Subject} from 'rxjs';

@Component({
    selector: 'app-add-note',
    templateUrl: './add-note.component.html',
    styleUrls: ['./add-note.component.scss']
})
export class AddNoteComponent implements OnInit {

    form: FormGroup;
    allData;
    myModel: any;
    modalData: any;
    public onClose: Subject<boolean>;
    myControl = new FormControl('', Validators.required);
    contacts: any = [];
    isSelected = false;

    contactId: string;

    constructor(
        private fb: FormBuilder, public http: HttpService
    ) {
        this.myModel = new TableModel();
        
    }

    ngOnInit(): void {
        if (this.modalData) {
            this.contactId = this.modalData.contactId;
        }
        this.formInit();
        this.getList();
    }

    finalSelected() {
        this.isSelected = true;
        const temp = JSON.parse(JSON.stringify(this.myControl.value));
        if (temp.lastName) {
            this.myControl.patchValue(temp.firstName + ' ' + temp.lastName);
        } else {
            this.myControl.patchValue(temp.firstName);
        }
        this.form.controls.contactId.patchValue(temp._id);
    }

    clearSearch() {
        if (!this.isSelected) {
            this.myControl.patchValue('');
        }
    }

    getList(val?) {
        this.isSelected = false;
        const obj: any = {
            skip: 0,
            limit: 10,
            search: val ? val : ''
        };
        this.http.getData(ApiUrl.CONTACTS, obj).subscribe(res => {
                this.contacts = res.data.data;
            },
            () => {
            });
    }

    formInit() {
        this.form = this.fb.group({
            contactId: ['', Validators.required],
            text: ['', Validators.required]
        });
        if (this.contactId) {
            this.form.get('contactId').patchValue(this.contactId);
        }
    }

    finalSubmit() {
        if (this.http.isFormValid(this.form)) {
            this.http.hideModal();
            this.http.postData(ApiUrl.ADD_EDIT_NOTES, this.form.value)
                .subscribe(() => {
                    this.http.contactUpdated();
                    this.http.openSnackBar('Note Added Successfully');
                    this.onClose.next(true);
                }, () => {
                });
        }
    }

}
