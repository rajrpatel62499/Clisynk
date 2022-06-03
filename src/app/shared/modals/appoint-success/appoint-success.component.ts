import {Component} from '@angular/core';
import {HttpService} from '../../../services/http.service';
import {ContactDetailsComponent} from '../contact-details/contact-details.component';
import {AppointmentService} from '../../../internal/appointments/appointment.service';

@Component({
    selector: 'app-appoint-success',
    templateUrl: './appoint-success.component.html'
})
export class AppointSuccessComponent {

    modalData: any;

    constructor(public http: HttpService, public appoint: AppointmentService) {
    }

    finalSubmit() {
        this.http.hideModal();
    }

    openContact() {
        this.http.hideModal();
        this.http.showModal(ContactDetailsComponent, 'md', this.modalData.contactId);
    }

    showAppointMent() {
        this.http.hideModal();
        // this.appoint.openBooking(this.modalData.appointName.name);
    }

}
