import {Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {HttpService} from '../../../services/http.service';
import {TableModel} from '../../models/table.common.model';
import {AppointmentService} from '../../../internal/appointments/appointment.service';
import {EditAppointmentComponent} from '../edit-appointment/edit-appointment.component';
import {Subject, Subscription} from 'rxjs';
import {ApiUrl} from '../../../services/apiUrls';
import {AppointBookComponent} from '../appoint-book/appoint-book.component';

@Component({
    selector: 'app-appoint-type-list',
    templateUrl: './appoint-type-list.component.html'
})
export class AppointTypeListComponent implements OnInit, OnDestroy {

    @Input() allData: any;
    myModel: any;
    @Output() finalSubmit: EventEmitter<any> = new EventEmitter();
    subscription: Subscription;
    selectedTypeIndex = undefined;
    modalRef: any;

    constructor(public http: HttpService, public appoint: AppointmentService) {
        this.myModel = new TableModel();
        this.subscription = this.http.eventStatus.subscribe(data => {
            if (data && data.eventType === 'addAppointType') {
                this.getList();
                this.myModel.appointmentTypes = this.allData;
            }
        });
    }

    ngOnInit(): void {
        this.getList();
    }

    ngOnDestroy(): void {
        this.subscription.unsubscribe();
    }

    getList() {
        this.http.getData(ApiUrl.APPOINTMENT_LIST_TYPES, {}).subscribe(res => {
            this.myModel.appointmentTypes = res.data;
        });
    }

    openEditType(data) {
        const modalRef = this.http.showModal(EditAppointmentComponent, 'full-screen', data);
        modalRef.content.onClose = new Subject<boolean>();
        modalRef.content.onClose.subscribe(res => {
            this.getList();
        });
    }

    openDeleteType(selectedTypeIndex, template) {
        this.selectedTypeIndex = selectedTypeIndex;
        this.http.showModal(template, 'xs');
    }

    openBook(data) {
        this.modalRef = this.http.showModal(AppointBookComponent, 'md', data);
        this.modalRef.content.onChange = new Subject<boolean>();
        this.modalRef.content.onChange.subscribe(res => {
            res ? this.modalRef.setClass('modal-more-lg') : this.modalRef.setClass('modal-md');
        });
    }

    deleteAppointmentType(flag, id, index?) {
        const obj: any = {
            type: flag,
            id: id
        };
        this.http.postData(ApiUrl.DELETE_APPOINT_TYPE, obj).subscribe(() => {
            if (flag === 1) {
                this.myModel.appointmentTypes.splice(this.selectedTypeIndex, 1);
            } else {
                this.myModel.appointments.splice(index, 1);
                this.http.openSnackBar('Appointment Cancelled Successfully');
            }
        });
    }

}
