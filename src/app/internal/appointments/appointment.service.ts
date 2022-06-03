import {Injectable} from '@angular/core';
import {HttpService} from '../../services/http.service';
import * as moment from 'moment';

@Injectable({
    providedIn: 'root'
})
export class AppointmentService {

    constructor(public http: HttpService) {
    }

    sendInvite(val) {
        const data: any = JSON.parse(JSON.stringify(val));
        data.topTitle = 'Send an invite';
        data.subject = 'Pick a time for us to meet';
        data.content = `<br><br><section class="email-content">
        <p>Hi,</p>
        <p>I&#39;d like to meet. Is there a time that works for you?</p>
                <p>Follow the link and you&#39;ll see all of my available dates and times. I&#39;m looking forward to it!</p>
        <p><a href="${this.getBookingLink(data.name)}">${this.getBookingLink(data.name)}</a></p>
        <p>Thank you,</p>`;
        this.http.openModal('sendEmail', data);
    }

    reschedule(val) {
        const data: any = JSON.parse(JSON.stringify(val));
        data.topTitle = 'Email appointment invite';
        data.contactId = JSON.parse(JSON.stringify([data.contactId]));
        // data.contactId = data.contactId;
        data.openFrom = 'deal';
        data.subject = 'Can we reschedule?';
        data.content = `<br><br><section class="email-content">
        <p>Hi,</p>
        <p>I'm so sorry, but I need to reschedule our upcoming appointment.</p>
        <p>Please click the link below to choose an alternate day and time that works for your schedule.</p>
                <p><a href="${this.editBookingTime(data)}">${this.editBookingTime(data)}</a></p>
        <p>Thanks in advance for your understanding.</p>`;

        this.http.openModal('sendEmail', data);
    }

    openBooking(name) {
        const url = this.http.domain + '/booking/' + name;
        this.http.openInNewTab(url);
    }

    copied(e) {
        this.http.openSnackBar('Invite link has been copied to your clipboard');
    }

    getBookingLink(name) {
        return this.http.domain + '/booking/' + name;
    }

    editBookingTime(data) {
        return this.http.domain + '/booking/' + data.appointmentId.name + '?bookingId=' + data._id;
    }

    getTimeFromMin(data) {
        return moment().month(0).date(1).hours(0).minutes(data).seconds(0).milliseconds(0).format('hh:mm a');
    }
}
