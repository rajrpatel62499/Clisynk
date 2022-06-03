import {Component, OnInit, ViewChild} from '@angular/core';
import {TableModel} from '../../models/table.common.model';
import {HttpService} from '../../../services/http.service';
import {AppointStep1Component} from '../appoint-step-1/appoint-step-1.component';
import {ApiUrl} from '../../../services/apiUrls';
import {AppointStep3Component} from '../appoint-step-3/appoint-step-3.component';
import {AppointStep2Component} from '../appoint-step-2/appoint-step-2.component';
import {Subject} from 'rxjs';

@Component({
    selector: 'app-edit-appointment',
    templateUrl: './edit-appointment.component.html'
})
export class EditAppointmentComponent implements OnInit {

    @ViewChild(AppointStep1Component, {static: false}) child1: AppointStep1Component;
    @ViewChild(AppointStep2Component, {static: false}) child2: AppointStep2Component;
    @ViewChild(AppointStep3Component, {static: false}) child3: AppointStep3Component;
    allData: any;
    myModel: any;
    modalData: any;
    selectedStep = 2;
    public onClose: Subject<boolean>;

    constructor(public http: HttpService) {
        this.myModel = new TableModel();
    }

    ngOnInit(): void {
    }

    goBack() {
        switch (this.selectedStep) {
            case 3:
                this.selectedStep = 2;
                break;
            case 2:
                this.selectedStep = 1;
                break;
        }
    }

    finalSubmit() {
        let obj: any = {};
        obj = {
            ...obj,
            ...this.setStep1Val(),
            ...this.setStep2Val(),
            ...{instructions: this.child3.instructions.value}

        };

        console.log('332423432432',obj)
        this.apiHit(obj);
        this.http.hideModal();
    }

    setStep2Val() {

        const obj: any = this.child2.form.value;
        if (this.child2.availability.length) {
            obj.availability = JSON.stringify(this.child2.availability);
        }
        return obj;
    }

    setStep1Val() {
        const location: any = {
            type: this.child1.form.value.selectedLoc,
            radioSelected: this.child1.radioSelected
        };

        if (this.child1.radioSelected) {
            let input = '';
            this.child1.showItems.forEach((val) => {
                if (val.radioSelected == this.child1.radioSelected) {
                    if (val.input) {
                        input = val.input;
                    }
                }
            });
            if (input) {
                location.input = input;
            }
        }
        const obj: any = {
            name: this.child1.form.value.name
        };

        if (location) {
            obj.location = JSON.stringify(location);
        }
        return obj;
    }

    apiHit(obj) {

        if (this.modalData) {
            obj.appointmentId = this.modalData._id;
        }
        this.http.postData(ApiUrl.ADD_APPOINTMENT_TYPE, obj).subscribe(res => {
            this.allData = res.data;
            this.http.eventSubject.next({eventType: 'addAppointType', data: {}});
            this.http.openSnackBar('Updated Successfully');
        });
    }

    checkDisable() {
        if (this.child1 && this.child1.form && this.child1.isEdit) {
            if (!this.child1.form.valid) { return true; }
            else if (this.child1.showPatternError) { return true }
            else { return !this.child1.form.valid }
        }
    }

}
