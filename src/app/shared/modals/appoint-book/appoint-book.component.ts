import { finalize } from 'rxjs/operators';
import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {HttpService} from '../../../services/http.service';
import {TableModel} from '../../models/table.common.model';
import {ApiUrl} from '../../../services/apiUrls';
import {Subject} from 'rxjs';
import {appointMentList} from '../../../services/constants';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import * as moment from 'moment';
import * as _ from 'lodash';

@Component({
    selector: 'app-appoint-book',
    templateUrl: './appoint-book.component.html',
    styleUrls:['./appoint-book.component.scss']
})
export class AppointBookComponent implements OnInit {

    form: FormGroup;
    allData;
    myModel: any;
    modalData: any;
    public onClose: Subject<boolean>;
    myControl = new FormControl('', Validators.required);
    contacts: any = [];
    isSelected = false;
    dateSelected = false;
    calendarPlugins = [dayGridPlugin, interactionPlugin];
    todayDate: any = new FormControl(new Date());
    selectedType: any;
    calendarEvents = [
        {title: '', date: new Date()}
    ];
    contactId: any = {};
    public onChange: Subject<boolean>;
    validRange: any = {};
    selectedtIndex = undefined;
    isLoading = false;

    constructor(public http: HttpService) {
        this.myModel = new TableModel();
        this.todayDate.valueChanges.subscribe(() => {
            this.getSlots();
        });
    }

    ngOnInit(): void {
        this.formInit();
        this.contactList();
        this.appointList();
        this.validRange = {
            start: new Date()
        };
        if (this.modalData && this.modalData.location) {
            this.changeAppoint();
        }
    }

    finalSelected() {
        this.isSelected = true;
        const temp = JSON.parse(JSON.stringify(this.myControl.value));
        this.contactId = JSON.parse(JSON.stringify(this.myControl.value));
        if (temp.lastName) {
            this.myControl.patchValue(temp.firstName + ' ' + temp.lastName);
        } else {
            this.myControl.patchValue(temp.firstName);
        }
        this.form.controls.contactId.patchValue(temp._id);
    }

    clearSearch() {
        if (!this.isSelected) {
            this.myControl.patchValue('');
        }
    }

    contactList(val?) {
        this.isSelected = false;
        const obj: any = {
            skip: 0,
            limit: 10,
            search: val ? val : ''
        };
        this.http.getData(ApiUrl.CONTACTS, obj).subscribe(res => {
            res.data.data.forEach((val) => {
                this.http.checkLastName(val);
                if (val.email) {
                    val.showName = val.showName + ` (${val.email})`;
                }
            });
            this.contacts = res.data.data;
            if (this.modalData && this.modalData.contactsType) {
                this.myControl.patchValue(this.modalData);
                this.finalSelected();
            }

        });
    }

    appointList() {
        this.http.getData(ApiUrl.APPOINTMENT_LIST_TYPES, {}).subscribe(res => {
            this.myModel.appointmentTypes = res.data;
            if (this.modalData) {
                this.form.controls.appointmentId.patchValue(res.data[this.http.findIndex(res.data, '_id', this.modalData._id)]);
            }
        });
    }

    formInit() {
        this.form = this.http.fb.group({
            contactId: ['', Validators.required],
            appointmentId: ['', Validators.required]
        });
    }

    firstSubmit() {
        if (this.http.isFormValid(this.form)) {

            this.onChange.next(true);

            this.dateSelected = true;
            this.getSlots();
        }
    }

    finalSubmit(data) {
        if (this.http.isFormValid(this.form)) {
            const obj: any = JSON.parse(JSON.stringify(this.form.value));
            obj.appointmentId = this.form.value.appointmentId._id;
            obj.date = new Date(this.todayDate.value).getTime();
            obj.startTime = data.start;
            obj.endTime = data.end;
            if (this.form.value.contactId.length) {
                obj.contactId = JSON.stringify(this.http.getIdsOnly(this.form.value.contactId));
            }

            this.isLoading = true;
            this.http.postData(ApiUrl.APPOINT_BOOK_NOW, obj).pipe(finalize(() => {this.isLoading=false;})).subscribe(() => {
                this.http.hideModal();
                this.http.eventSubject.next({eventType: 'addAppoint', obj});
                const sendData: any = {
                    contactId: this.contactId,
                    appointName: this.form.value.appointmentId
                };
                this.http.openModal('appointSuccess', sendData);
                this.http.openSnackBar('Booked Successfully');
            }, () => {
            });
        }
    }
    
    selectedSlot;
    onSelectSlot(slot) {
        this.selectedSlot = slot;
    }
    changeAppoint() {
        const type = this.form.value.appointmentId.location ? this.form.value.appointmentId.location.radioSelected :
                this.modalData.location.type;
        this.selectedType = appointMentList.find(val => val.radioSelected === parseInt(type, 10));

        if(this.selectedType){
            if (this.selectedType.radioSelected === '1' || this.selectedType.radioSelected === '4' || this.selectedType.radioSelected === '5') {
                this.form.addControl('extrakey', new FormControl('', Validators.required));
            }
        }

    }

    handleDateClick(arg) {
        this.calendarEvents = [
            {title: '.', date: new Date(arg.dateStr)}
        ];
        this.todayDate.patchValue(new Date(arg.dateStr));
        this.selectedSlot = null;
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
            name: this.form.value.appointmentId.name,
            day: day,
            timeZone : this.http.getTimeZone()
        };
        this.myModel.loader = true;
        this.myModel.slots = [];
        this.http.getData(ApiUrl.LIST_SLOTS, obj).subscribe(res => {
                    this.myModel.slots = res.data;
                    this.myModel.loader = false;
                }
        );
    }
}

