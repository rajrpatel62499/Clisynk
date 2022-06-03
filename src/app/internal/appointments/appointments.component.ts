import {Component, HostListener, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {FormGroup} from '@angular/forms';
import {HttpService} from '../../services/http.service';
import {AddAppointmentComponent} from '../../shared/modals/add-appointment/add-appointment.component';
import {TableModel} from '../../shared/models/table.common.model';
import {ApiUrl} from '../../services/apiUrls';
import {Subject, Subscription} from 'rxjs';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import {AppointmentService} from './appointment.service';
import {FullCalendarComponent} from '@fullcalendar/angular';
import * as moment from 'moment';
import {AppointBookComponent} from '../../shared/modals/appoint-book/appoint-book.component';

declare var $: any;

@Component({
    selector: 'app-appointments',
    templateUrl: './appointments.component.html'
})

export class AppointmentsComponent implements OnInit, OnDestroy {

    @ViewChild('calendar', {static: false}) calendarComponent: FullCalendarComponent;
    selectedDate: any = new Date();
    myModel: any;
    form: FormGroup;
    calendarPlugins = [dayGridPlugin, interactionPlugin];
    subscription: Subscription;
    isMonth = true;
    calendarEvents: any = [
        {title: 3, date: this.selectedDate}
    ];
    modalRef: any;
    validRange: any = {};
    showAppoint = true;
    appointLoader = false;

    constructor(public http: HttpService, public appoint: AppointmentService) {
        this.myModel = new TableModel();
        this.subscription = this.http.eventStatus.subscribe(data => {
            if (data && data.eventType === 'addAppointType') {
                this.appointTypeList();
            } else if (data && data.eventType === 'addAppoint') {
                this.getAppointments();
            }
        });

    }



    @HostListener('click', ['$event']) onClick(event) {
        console.log('component is clicked', event.srcElement.className == 'fc-today-button fc-button fc-button-primary');
        console.log(event);
        if (event.srcElement.className == 'fc-today-button fc-button fc-button-primary') {
            let obj: any = {
                dateStr: moment().format('YYYY-MM-DD')
            };
            this.handleDateClick(obj);
        }
    }

    ngOnInit() {
        this.appointTypeList();
        this.getAppointments();
        this.validRange = {
            start: new Date()
        };
        // document.getElementById('my-today-button').addEventListener('click', function() {
        //
        //     console.log('ccdcd');
        //
        // });
    }

    ngOnDestroy(): void {
        this.subscription.unsubscribe();
    }

    handleDateClick(arg) {
        console.log(arg, 'argargargargargargargarg');
        this.calendarEvents = [];
        this.selectedDate = new Date(arg.dateStr);
        this.calendarEvents = [
            {title: '.', date: this.selectedDate}
        ];
        this.isMonth = false;
        this.getAppointments();
    }

    openBook() {
        this.modalRef = this.http.showModal(AppointBookComponent, 'md');
        this.modalRef.content.onChange = new Subject<boolean>();
        this.modalRef.content.onChange.subscribe(res => {
            res ? this.modalRef.setClass('modal-more-lg') : this.modalRef.setClass('modal-md');
        });
    }

    openAddAppoint() {
        this.http.showModal(AddAppointmentComponent, 'full-screen');
    }

    getAppointments() {
        const obj: any = {};
        if (this.isMonth) {
            obj.month = new Date(this.selectedDate).getMonth();
        } else {
            obj.date = moment(this.selectedDate).format('MM/DD/YYYY');
        }
        this.appointLoader = true;
        this.http.getData(ApiUrl.APPOINTMENTS, obj).subscribe(res => {
            this.myModel.appointments = res.data;
            this.appointLoader = true;
        }, () => {
            this.appointLoader = true;
        });
    }

    changeMonth(val) {
        const calendarApi = this.calendarComponent.getApi();
        val === 1 ? calendarApi.prev() : calendarApi.next();
        this.selectedDate = new Date(calendarApi.state.currentDate);
        this.isMonth = true;
        this.getAppointments();
    }

    appointTypeList() {
        this.myModel.loader = true;
        this.http.getData(ApiUrl.APPOINTMENT_LIST_TYPES, {}).subscribe(res => {
            this.myModel.loader = false;
            this.myModel.appointmentTypes = res.data;
        }, () => {
            this.myModel.loader = false;
        });
    }

}
