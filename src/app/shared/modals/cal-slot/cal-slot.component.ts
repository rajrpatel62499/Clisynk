import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {HttpService} from '../../../services/http.service';
import {TableModel} from '../../models/table.common.model';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import {FullCalendarComponent} from '@fullcalendar/angular';
import * as moment from 'moment';
import {ApiUrl} from '../../../services/apiUrls';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {AppointmentService} from '../../../internal/appointments/appointment.service';
import {appointMentList} from '../../../services/constants';
import {parse} from '@fullcalendar/core/datelib/parsing';

@Component({
    selector: 'app-cal-slot',
    templateUrl: './cal-slot.component.html'
})
export class CalSlotComponent implements OnInit {
    @ViewChild('calendar', {static: false}) calendarComponent: FullCalendarComponent;

    @Input() allData: any;
    myModel: any;
    selectedIndex = undefined;
    modalData: any;
    calendarPlugins = [dayGridPlugin, interactionPlugin];
    todayDate: any = new FormControl(new Date());
    checkBox: any = new FormControl(true);
    selectedSlot: any = null;
    form: FormGroup;
    successMsg = false;
    appointMentList = appointMentList;
    calendarEvents = [
        {title: '', date: new Date()}
    ];

    validRange: any = {};

    handleDateClick(arg) {
        this.calendarEvents = [
            {title: '.', date: new Date(arg.dateStr)}
        ];
        this.todayDate.patchValue(new Date(arg.dateStr));
    }

    constructor(public http: HttpService, public appoint: AppointmentService) {
        this.myModel = new TableModel();
        this.todayDate.valueChanges.subscribe(() => {
            this.getSlots();
        });
    }

    ngOnInit(): void {
        this.getSlots();
        this.validRange = {
            start: new Date()
        };
        this.form = this.http.fb.group({
            firstName: ['', Validators.required],
            lastName: ['', Validators.required],
            email: ['', Validators.compose([Validators.required, Validators.pattern(this.http.CONSTANT.EMAIL_REGEX)])],
            phoneNumber: ['', Validators.required]
        });
    }

    lastBookingData: any = {};

    whereText = '';

    finalSubmit() {
        if (this.http.isFormValid(this.form) || this.allData.bookingId) {
                let obj: any = {};
                if (this.allData.bookingId) {
                    obj.bookingId = this.allData.bookingId;
                } else {
                    obj = this.form.value;
                }
                obj.appointmentName = this.allData.name;
                obj.date = new Date(this.todayDate.value).getTime();
                obj.startTime = this.selectedSlot.start;
                obj.endTime = this.selectedSlot.end;

                this.http.postData(ApiUrl.BOOK_NOW_OUTSIDE, obj).subscribe(res => {
                    this.lastBookingData = res.data;

                    if (this.lastBookingData.appointmentId.location && this.lastBookingData.appointmentId.location.radioSelected) {
                        switch (parseInt(this.lastBookingData.appointmentId.location.radioSelected)) {
                            case 1 :
                            case 4 :
                            case 5 :
                                this.whereText = this.lastBookingData.appointmentId.location.input;
                                break;
                            case 2:
                                this.whereText = 'Ask attendees to use their online meeting link';
                                break;
                            case 3:
                                this.whereText = 'Admin will call the lead or client';
                                break;
                            case 6:
                                this.whereText = 'Invitee will choose the location';
                                break;
                        }
                    }

                    this.successMsg = true;

                    if (this.allData.bookingId) {
                    } else {
                        this.selectedSlot = null;
                        this.form.markAsUntouched();
                        this.form.reset();
                    }
                    this.http.openSnackBar(this.allData.bookingId ? 'Updated' : 'Submitted' + ' Successfully');
                }, () => {
                });
            }
    }

    next(flag) {
        if (flag === 1) {
            this.todayDate.patchValue(moment(new Date(this.todayDate.value)).add(-1, 'day').format());
        } else {
            this.todayDate.patchValue(moment(new Date(this.todayDate.value)).add(1, 'day').format());
        }

        this.calendarEvents = [
            {title: '.', date: new Date(this.todayDate.value)}
        ];
    }

    getSlots() {
        const day = moment(this.todayDate.value).format('ddd');
        const obj = {
            name: this.allData.name,
            day: day,
            timeZone : this.http.getTimeZone()
        };
        this.myModel.slots = [];
        this.myModel.loader = true;
        this.http.getData(ApiUrl.LIST_SLOTS, obj).subscribe(res => {
                    this.myModel.slots = res.data;
                    this.myModel.loader = false;
                }
        );
    }
}
