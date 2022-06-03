import { AddAppointmentComponent } from './../add-appointment/add-appointment.component';
import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {HttpService} from '../../../services/http.service';
import {TableModel} from '../../models/table.common.model';
import {ApiUrl} from '../../../services/apiUrls';
import {EditorContent} from '../../models/editor.model';
import {Subject} from 'rxjs';
import {UploadComponent} from '../upload/upload.component';
import {EmailTemplateComponent} from '../email-template/email-template.component';
import {CancelConfirmComponent} from '../cancel-confirm/cancel-confirm.component';
import {AppointmentService} from '../../../internal/appointments/appointment.service';

@Component({
    selector: 'app-send-email',
    templateUrl: './send-email.component.html',
    styleUrls: ['./send-email.component.scss']
})
export class SendEmailComponent implements OnInit {

    form: FormGroup;
    allData;
    myModel: any;
    modalData: any;
    signStatus = new FormControl();
    ckeConfig: any = EditorContent;
    public onClose: Subject<boolean>;
    loginData: any;
    invoiceQuoteId: any;
    filesData: any = [];
    isContact = false;
    selectedContacts = [];
    contactSettings: any = {
        idField: '_id',
        textField: 'showName',

        allowSearchFilter: true,
        'disabled': true
    };

    // itemsShowLimit: 5,
    constructor(public http: HttpService, public appoint: AppointmentService) {
        this.myModel = new TableModel();
    }

    ngOnInit(): void {
        console.log(this.modalData);
        this.loginData = JSON.parse(localStorage.getItem('loginData'));
        this.formInit(this.modalData);
        console.log(this.modalData);
        this.templateList();
        this.contactList();
        this.getAppointments();
    }

    formInit(data) {
        this.form = this.http.fb.group({
            contactId: [data && data._id ? data._id : ''],
            email: [data && data.email ? data.email : '',
                Validators.compose([Validators.pattern(this.http.CONSTANT.EMAIL_REGEX)])],
            subject: [data && data.subject ? data.subject : '', Validators.required],
            content: [data && data.html ? data.html : '', Validators.required],
            dealId: [data && data._id ? data._id : ''],
            emailArray: ['']
        });

        if (data) {

            if (data.invoiceQuoteId) {
                this.invoiceQuoteId = data.invoiceQuoteId;
            }
            if (data.filesData && data.filesData.length) {
                this.filesData = data.filesData;
            }

            if (data.content) {
                this.form.controls.content.patchValue(data.content);
            }

            // if (data._id) {
            //     this.isContact = true;
            // }

            if (data.sendEmail === 'introductionEmail') {
                this.form.patchValue({
                    content: this.loginData.introductionEmail
                });
            } else if (data.sendEmail === 'followupEmail') {
                this.form.patchValue({
                    content: this.loginData.followupEmail
                });
            }

            // deal information
            // if (this.modalData.name) {
            if (this.modalData.openFrom === 'deal') {
                this.modalData.contactId.forEach((val) => {
                    this.http.checkLastName(val);
                });
                this.selectedContacts = this.modalData.contactId;
                const contacts: any = this.http.getIdsOnly(this.modalData.contactId);
                this.form.controls.contactId.patchValue(JSON.stringify(contacts));
            }
            // deal information ended

        }
    }

    checkEmailExist(val) {
        if (val.email) {
            val = val.showName + '(' + val.email + ')';
        } else {
            val = val.showName;
        }
        return val;
    }

    finalSelected() {
        const temp = JSON.parse(JSON.stringify(this.form.value.email));
        this.form.controls.email.patchValue(temp.email);
        this.form.controls.contactId.patchValue(temp._id);
    }

    contactList(val?) {
        const obj: any = {
            skip: 0,
            limit: 1000,
            search: val ? val : ''
        };
        this.http.getData(ApiUrl.CONTACTS, obj).subscribe(res => {
            this.myModel.contacts = [];
            res.data.data.forEach((val1) => {
                this.http.checkLastName(val1);
                this.myModel.contacts.push(val1);
            });
            if (this.modalData && this.modalData.contactId) {
                this.modalData.contactId.forEach((val1) => {
                    this.http.checkLastName(val1);
                });
                this.selectedContacts = this.http.selectedInArray(this.myModel.contacts, this.modalData.contactId);
            }
        });
    }

    deleteFile(data, index) {
        const obj: any = {
            thumbnail: data.thumbnail,
            original: data.original
        };
        this.filesData.splice(index, 1);
        this.http.postData(ApiUrl.DELETE_IMAGE, obj);
    }

    selectTemplate(data) {
        this.form.patchValue({
            subject: data.subject,
            content: data.html
        });
    }

    finalSubmit() {
        if (this.http.isFormValid(this.form)) {
            this.http.hideModal();
            const obj: any = this.form.value;
            if (this.filesData.length) {
                const tempFiles: any = [];
                this.filesData.forEach(val => {
                    tempFiles.push({
                        original: val.original,
                        thumbnail: val.thumbnail
                    });
                });
                obj.filesData = JSON.stringify(tempFiles);
            }

            if (this.invoiceQuoteId) {
                obj.invoiceQuoteId = this.invoiceQuoteId;
            }

            if (this.signStatus.value) {
                const temp = this.form.value.content + `<br><br><section class="signature-preview">
                <h4>${this.loginData.name}</h4> <p>${this.loginData.email}</p><p>${this.loginData.countryCode ? this.loginData.countryCode : ''}${this.loginData.phoneNumber ? this.loginData.phoneNumber : ''}</p>
                 </section>`;
                this.form.controls.content.patchValue(temp);
                obj.content = temp;
            }

            if (this.modalData.contactId) {
                const contacts: any = this.http.getIdsOnly(this.modalData.contactId);
                this.form.controls.contactId.patchValue(JSON.stringify(contacts));
                obj.contactId = contacts;
            }

            if(this.modalData.contactId && this.modalData.openFrom === 'deal'){
                delete obj.contactId;
                obj.emailArray = JSON.stringify(this.http.getEmailsOnly(this.modalData.contactId));
            }

            if (this.modalData.contactId && this.modalData.contactId[0].email) {
                obj.email = this.modalData.contactId[0].email;
            }
            this.http.postData(ApiUrl.SEND_EMAIL, obj).subscribe(() => {
                if (this.invoiceQuoteId) {
                    this.http.openModal('successModal', {flag: 2});
                } else {
                    this.http.openSnackBar('Sent Successfully');
                }
                this.http.updateEvent('emailSent');
            }, () => {
            });
        }
    }

    openUpload() {
        this.http.hideModal();
        this.modalData = this.form.value;
        this.modalData.filesData = this.filesData;
        this.http.showModal(UploadComponent, 'md', this.modalData);
    }

    openAddAppointment() {
        this.http.hideModal();
        this.http.showModal(AddAppointmentComponent, 'more-lg', this.modalData);
    }

    openTemplate() {
        this.http.hideModal();
        this.http.showModal(EmailTemplateComponent, 'more-lg', this.modalData);
    }

    templateList() {
        const obj = {skip: 0, limit: 30};
        this.http.getData(ApiUrl.TEMPLATE_LIST, obj).subscribe(res => {
            this.myModel.templates = res.data.data;
        });
    }

    openConfirmModal() {
        const modalRef = this.http.showModal(CancelConfirmComponent, 'md new-close');
        modalRef.content.onClose = new Subject<boolean>();
        modalRef.content.onClose.subscribe(() => {
            this.http.hideModal();
        });
    }


    getAppointments() {
        this.http.getData(ApiUrl.APPOINTMENT_LIST_TYPES, {}).subscribe(res => {
            this.myModel.appointmentTypes = res.data;
        });
    }

    addLink(data) {
        const tempContent = this.form.value.content + `<br><a style="color:blue">${this.appoint.getBookingLink(data.name)}</a><br>`;
        this.form.controls.content.patchValue(tempContent);
    }

}
