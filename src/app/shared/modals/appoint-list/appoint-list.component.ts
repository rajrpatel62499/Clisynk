import {Component, EventEmitter, Input, Output} from '@angular/core';
import {HttpService} from '../../../services/http.service';
import {TableModel} from '../../models/table.common.model';
import {AppointmentService} from '../../../internal/appointments/appointment.service';
import {Subject} from 'rxjs';
import {ApiUrl} from '../../../services/apiUrls';
import {ConfirmComponent} from '../confirm/confirm.component';

import {ContactDetailsComponent} from '../contact-details/contact-details.component';

@Component({
    selector: 'app-appoint-list',
    templateUrl: './appoint-list.component.html'
})
export class AppointListComponent {
    @Input() allData: any;
    myModel: any;
    @Output() finalSubmit: EventEmitter<any> = new EventEmitter();
    // selectedTypeIndex = undefined;

    constructor(public http: HttpService, public appoint: AppointmentService) {
        this.myModel = new TableModel();

    }

    deleteAppointmentType(flag, id, mainIndex?, innerIndex?) {
        const obj: any = {
            type: flag,
            id: id
        };
        this.allData[mainIndex].data.splice(innerIndex, 1);
        this.http.postData(ApiUrl.DELETE_APPOINT_TYPE, obj).subscribe(() => {
            this.http.openSnackBar('Appointment Cancelled Successfully');
        }, () => {
        });
    }

    cancelAppointment(data, mainIndex, innerIndex) {
        const obj: any = {
            title: 'Cancel appointment?',
            message: 'We will email your client to let them know you are canceling this appointment.'
        };
        const modalRef = this.http.showModal(ConfirmComponent, 'xs', obj);
        modalRef.content.onClose = new Subject<boolean>();
        modalRef.content.onClose.subscribe(res => {
            if (res) {
                this.deleteAppointmentType(2, data._id, mainIndex, innerIndex);
            }
        });
    }

    openContactDetails(data) {
        this.http.showModal(ContactDetailsComponent, 'md', data.contactId);
    }

}
