import {Component, OnInit} from '@angular/core';
import {HttpService} from '../../../services/http.service';
import {TableModel} from '../../models/table.common.model';
import {EmailFormatComponent} from '../email-format/email-format.component';
import {SendEmailComponent} from '../send-email/send-email.component';

@Component({
    selector: 'app-contact-options',
    templateUrl: './contact-options.component.html'
})
export class ContactOptionsComponent implements OnInit {

    allData;
    myModel: any;
    modalData: any;
    contacts: any = [];
    currentTime = new Date();

    constructor(public http: HttpService) {
        this.myModel = new TableModel();
    }

    ngOnInit(): void {
        this.contacts = JSON.parse(this.modalData.multiPhoneNumber);
    }

    openContactDetails() {
        this.http.hideModal();
        const temp = JSON.parse(JSON.stringify(this.modalData));
        temp._id = localStorage.getItem('contactId');
        localStorage.setItem('savedData', JSON.stringify(temp));
        this.http.sendSearch(temp);
        this.http.navigate('contacts');
    }

    introduceEmail(subject) {
        this.modalData.sendEmail = 'introductionEmail';
        if (subject) {
            this.modalData.subject = subject;
        }
        this.http.hideModal();
        this.http.showModal(SendEmailComponent, 'md', this.modalData);
    }

    followUpEmail(subject) {
        if (subject) {
            this.modalData.subject = subject;
        }
        this.http.hideModal();
        this.modalData.sendEmail = 'followupEmail';
        this.http.showModal(SendEmailComponent, 'md', this.modalData);
    }

    addAnotherContact() {
        this.http.hideModal();
        this.http.openModal('addContact', 'md');
    }

}
