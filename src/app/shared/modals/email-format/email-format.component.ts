import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {HttpService} from '../../../services/http.service';
import {TableModel} from '../../models/table.common.model';
import {ApiUrl} from '../../../services/apiUrls';
import {EditorContent} from '../../models/editor.model';

@Component({
    selector: 'app-email-format',
    templateUrl: './email-format.component.html'
})
export class EmailFormatComponent implements OnInit {

    form: FormGroup;
    allData;
    myModel: any;
    modalData: any;
    ckeConfig: any = EditorContent;
    from = new FormControl();
    loginData: any;

    constructor(
        private fb: FormBuilder,
        public http: HttpService
    ) {
        this.myModel = new TableModel();
    }

    ngOnInit(): void {
        this.loginData = JSON.parse(localStorage.getItem('loginData'));
        this.from.patchValue(this.loginData.email);
        this.formInit();
        this.fillValues();
    }

    formInit() {
        this.form = this.fb.group({
            contactId: [localStorage.getItem('contactId')],
            email: [this.modalData.email ? this.modalData.email : '', Validators.required],
            subject: ['', Validators.required],
            content: ['', Validators.required]
        });
    }

    fillValues() {
        if (this.modalData.subject) {
            this.form.controls.subject.patchValue(this.modalData.subject);
        }

        if (this.modalData.sendEmail === 'introductionEmail') {
            this.form.patchValue({
                content: this.loginData.introductionEmail
            });
        } else {
            this.form.patchValue({
                content: this.loginData.followupEmail
            });
        }
    }

    finalSubmit() {
        if (this.http.isFormValid(this.form)) {
            const obj: any = this.form.value;
            this.http.hideModal();
            this.http.postData(ApiUrl.SEND_EMAIL, obj)
                .subscribe(() => {
                    localStorage.removeItem('contactId');
                    this.http.contactUpdated();
                    this.http.openSnackBar('Sent Successfully');
                }, () => {
                });
        }
    }

}
