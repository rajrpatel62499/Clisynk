import {Component, OnInit, Input, SimpleChanges} from '@angular/core';
import {HttpService} from '../../../services/http.service';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import * as moment from 'moment';
import {availabilityList} from '../../../services/constants';
import {duration} from "moment";

@Component({
    selector: 'app-appoint-2',
    templateUrl: './appoint-step2.component.html'
})
export class AppointStep2Component implements OnInit {

    @Input() inputData: any;
    @Input() isEdit: boolean;
    form: FormGroup;
    durations = [
        {'name': '15 Minutes', value: 15},
        {'name': '30 Minutes', value: 30},
        {'name': '45 Minutes', value: 45},
        {'name': '1 Hour', value: 60},
        {'name': '90 Minutes', value: 90},
        {'name': '2 Hours', value: 120},
        // {'name': 'Custom', value: 'custom'}
    ];
    minute = new FormControl('');
    hour = new FormControl('');
    hours = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
    minutes = [0, 15, 30, 45];
    showCustom = false;
    availability = availabilityList;

    bufferTimes: any = [
        {name: 'No Buffer', value: 0},
        {name: '15 Minutes', value: 15},
        {name: '30 Minutes', value: 30},
        {name: '45 Minutes', value: 45}
    ];

    constructor(public http: HttpService) {
        this.form = this.http.fb.group({
            duration: [15],
            beforeBufferTime: [0, Validators.required],
            afterBufferTime: [0, Validators.required]
        });
    }

    ngOnInit(): void {
        if (this.isEdit) {
            this.fillValues();
        } else {
            this.fillSlots();
        }
    }

    fillSlots() {
        for (let i = 0; i < 5; i++) {
            for (let j = 0; j < 3; j++) {
                this.addAvailability(this.availability[i]);
            }
        }
    }

    fillValues() {
        this.form.patchValue({
            duration: this.inputData.duration,
            beforeBufferTime: this.inputData.beforeBufferTime,
            afterBufferTime: this.inputData.afterBufferTime
        });

        if (this.inputData.availability.length) {
            this.availability = this.inputData.availability;
        } else {
            this.availability = availabilityList;
        }
    }

    changeDuration() {
        this.availability = availabilityList.map(_b => {
            _b.timings = [];
            return _b;
        });
        this.fillSlots();
        this.showCustom = this.form.value.custom === 'custom';
    }

    addAvailability(data) {
        let start: any;
        let end: any;
        if (data.timings.length) {
            start = this.getNextSlot(data.timings[data.timings.length - 1].start);
            end = this.getNextSlot(start);
        } else {
            start = moment().month(0).date(1).hours(8).minutes(0).seconds(0).milliseconds(0).format();
            end = this.getNextSlot(start);
        }
        data.timings.push({start: start, end: end});
    }

    getNextSlot(date) {
        return new Date(new Date(date).setMinutes(new Date(date).getMinutes() + this.form.value.duration))
    }

    deleteAvailability(i, j) {
        this.availability[i].timings.splice(j, 1);
    }

}
