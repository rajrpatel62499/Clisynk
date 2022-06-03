import {Component, OnInit} from '@angular/core';
import {AbstractControl, FormBuilder, FormGroup, Validators} from '@angular/forms';
import {HttpService} from '../../../services/http.service';
import {TableModel} from '../../models/table.common.model';
import {ApiUrl} from '../../../services/apiUrls';
import {ContactOptionsComponent} from '../contact-options/contact-options.component';

@Component({
    selector: 'app-add-contact',
    templateUrl: './add-contact.component.html',
    styleUrls: ['./add-contact.component.scss']
})
export class AddContactComponent implements OnInit {

    form: FormGroup;
    allData;
    myModel: any;
    modalData: any;

    constructor(
            private fb: FormBuilder,
            public http: HttpService
    ) {
        this.myModel = new TableModel();
    }

    ngOnInit(): void {
        this.formInit();
        if (this.modalData) {
            this.fillValues();
        }
    }

    formInit() {
        this.form = this.fb.group({
            contactsType: [1, Validators.required],
            firstName: ['', Validators.required],
            lastName: ['', Validators.required],
            email: ['', [Validators.required, Validators.compose([Validators.pattern(this.http.CONSTANT.EMAIL_REGEX)])] ],
            countryCode: ['+91'],
            phoneNumber: ['', Validators.compose([Validators.required, Validators.minLength(10), Validators.maxLength(10), this.notAllZero]) ],
            notes: [''],
            type : ['work', Validators.required],
            sendEmail: [false]
        });
    }

    notAllZero(control: AbstractControl) {
        console.log(control.value)
        // let value: string = control.value;
        
            if(control.value == 0 && control.value.length == 10) {
                if (control.value == '') return;
                console.log("all zero");
                return {
                    allZeroError: true
                }
            }else {
                console.log("none all zero");
                return null;
            }
        
    }
    

    fillValues() {
        if (this.modalData.firstName) {
            this.form.controls.firstName.patchValue(this.modalData.firstName);
        }
        if (this.modalData.contactsType) {
            this.form.controls.contactsType.patchValue(this.modalData.contactsType);
        }
    }

    finalSubmit() {
        if (this.form.valid) {
            const obj: any = JSON.parse(JSON.stringify(this.form.value));
            obj.contactsType = parseInt(obj.contactsType, 10);
            obj.multiPhoneNumber = JSON.stringify([{phoneNumber: this.form.value.phoneNumber, type: this.form.value.type}]);
            delete obj.phoneNumber;
            delete obj.type;
            delete obj.sendEmail;
            this.http.hideModal();
            this.http.postData(ApiUrl.ADD_CONTACT, obj).subscribe(res => {
                localStorage.setItem('contactId', res.data._id);
                this.http.contactUpdated();
                this.http.eventSubject.next({eventType: 'addContact'});
                this.http.manipulateWorkspace(true);
                this.http.openSnackBar('Contact Added Successfully');
            }, () => {
            });
            this.http.showModal(ContactOptionsComponent, 'md', obj);
        }
    }

}
