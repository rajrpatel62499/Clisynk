import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {HttpService} from '../../../services/http.service';
import {TableModel} from '../../models/table.common.model';
import {ApiUrl} from '../../../services/apiUrls';
import {EditorContent} from '../../models/editor.model';
import {EmailTemplateComponent} from '../email-template/email-template.component';
import {AppointmentService} from '../../../internal/appointments/appointment.service';

@Component({
    selector: 'app-send-email',
    templateUrl: './pipeline-send-email.component.html'
})
export class PipelineSendEmailComponent implements OnInit {

    form: FormGroup;
    allData;
    myModel: any;
    modalData: any;
    ckeConfig: any = EditorContent;
    loginData: any;
    signStatus = new FormControl();


    constructor(public http: HttpService, public appoint: AppointmentService) {
        this.myModel = new TableModel();
        this.myModel.emailArrays = [
            {id: http.loginData.email, name: 'Primary Deal Contact'}
        ];
    }

    ngOnInit(): void {
        this.loginData = JSON.parse(localStorage.getItem('loginData'));
        this.formInit();
        this.getAppointments();
        this.templateList();
        this.contactList();
    }

    formInit() {
        const myData: any = this.modalData.emailData;
        this.form = this.http.fb.group({
            type: ['4'],
            from: [this.http.loginData.email],
            to: [this.myModel.emailArrays[0].id],
            subject: [myData ? myData.subject : '', Validators.required],
            html: [myData ? myData.html : '', Validators.required]
        });
    }

    addLink(data) {
        const tempContent = this.form.value.html + `<br><a style="color:blue">${this.appoint.getBookingLink(data.name)}</a><br>`;
        this.form.controls.html.patchValue(tempContent);
    }

    contactList(val?) {
        const obj: any = {
            skip: 0,
            limit: 10,
            search: val ? val : ''
        };
        this.http.getData(ApiUrl.CONTACTS, obj).subscribe(res => {
            this.myModel.contacts = res.data.data;
        });
    }

    selectTemplate(data) {
        this.form.patchValue({
            subject: data.subject,
            html: data.html
        });
    }

    finalSubmit() {

        if (!this.modalData.savedData.into) {
            this.modalData.into = [];
        } else { this.modalData.into = this.modalData.savedData.into; }

        if (!this.modalData.savedData.outof) {
            this.modalData.outof = [];
        } else { this.modalData.outof = this.modalData.savedData.outof; }


        if (this.http.isFormValid(this.form)) {

            const dataObj = {...this.form.value};

            if (this.signStatus.value) {
                dataObj.signValue =  true;
                dataObj.html =  this.form.value.html + `<br><br><section class="signature-preview">
                <h4>${this.loginData.name}</h4> <p>${this.loginData.email}</p><p>${this.loginData.countryCode ? this.loginData.countryCode : ''}${this.loginData.phoneNumber ? this.loginData.phoneNumber : ''}</p>
                 </section>`;
            }
            else dataObj.signValue = false;

            if (this.modalData.emailData && this.modalData.emailData.type) {
                if (this.modalData.selectedTab === 1) {
                    this.modalData.into[this.modalData.selectedIndex] = dataObj;
                } else {
                    this.modalData.outof[this.modalData.selectedIndex] = dataObj;
                }
            } else {
                if (this.modalData.selectedTab === 1) {
                    this.modalData.into.push(dataObj);
                } else {
                    this.modalData.outof.push(dataObj);
                }
            }
            this.apiHit();
        }
    }

    apiHit() {
        const obj: any = {
            pipelineId: this.modalData.pipelineId,
            stageId: this.modalData._id
        };
        obj.into = JSON.stringify(this.modalData.into || []);
        obj.outof = JSON.stringify(this.modalData.outof || []);

        if (this.modalData.allItems) {
            obj.automationId = this.modalData.allItems._id;
        }
        this.myModel.loader = true;
        this.http.postData(ApiUrl.CONFIGURE_AUTOMATION, obj).subscribe(res => {
            this.myModel.loader = false;
            this.modalData.automationConfigure = true;
            this.goBack();
        });
    }

    goBack() {
        this.http.hideModal();
        this.http.openModal('autoConfig', this.modalData);
    }

    openTemplate() {
        this.http.hideModal();
        this.modalData.fromPipeline = true;
        this.http.showModal(EmailTemplateComponent, 'more-lg', this.modalData);
    }

    getAppointments() {
        this.http.getData(ApiUrl.APPOINTMENT_LIST_TYPES, {}).subscribe(res => {
            this.myModel.appointmentTypes = res.data;
        });
    }

    templateList() {
        const obj = {
            skip: 0,
            limit: 30
        };
        this.http.getData(ApiUrl.TEMPLATE_LIST, obj).subscribe(res => {
            this.myModel.templates = res.data.data;
        }, () => {
        });
    }

}
