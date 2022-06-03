import { Subject } from 'rxjs';
import {Component, ViewChild} from '@angular/core';
import {TableModel} from '../../models/table.common.model';
import {HttpService} from '../../../services/http.service';
import {AppointStep1Component} from '../appoint-step-1/appoint-step-1.component';
import {ApiUrl} from '../../../services/apiUrls';
import {AppointStep3Component} from '../appoint-step-3/appoint-step-3.component';
import {AppointStep2Component} from '../appoint-step-2/appoint-step-2.component';

@Component({
    selector: 'app-add-appointment',
    templateUrl: './add-appointment.component.html',
    styleUrls: ['./add-appointment.component.scss']
})
export class AddAppointmentComponent {

    @ViewChild(AppointStep1Component, {static: false}) child1: AppointStep1Component;
    @ViewChild(AppointStep2Component, {static: false}) child2: AppointStep2Component;
    @ViewChild(AppointStep3Component, {static: false}) child3: AppointStep3Component;
    allData: any;
    myModel: any;
    modalData: any;
    selectedStep = 1;
    onClose: Subject<boolean>;

    constructor(public http: HttpService) {
        this.myModel = new TableModel();
    }

    closeBtnClick() {
        if (this.selectedStep === 1) {
            this.http.hideModal();
        } else {
            this.goBack();
        }
    }

    goBack() {
        switch (this.selectedStep) {
            case 2:
                this.selectedStep = 1;
                break;
            case 3:
                this.selectedStep = 2;
                break;
            case 4:
                this.selectedStep = 3;
                break;
        }
    }

    gotoStep(step) {
        switch (step) {
            case 2:
                if (this.child1.form.invalid) {
                    return;
                }
                break;
            case 3:
                if (this.child2.form.invalid) {
                    return;
                }
                break;
            case 4:
                if (this.child2.form.invalid) {
                    return;
                }
                break;
        }
        this.selectedStep = step;
    }

    finalSubmit(changeSelect?) {
        let obj: any = {};
        switch (this.selectedStep) {
            case 1:
                if (changeSelect) {
                    this.selectedStep = 2;
                }
                obj = this.setStep1Val();
                this.apiHit(obj);
                break;
            case 2:
                if (changeSelect) {
                    this.selectedStep = 3;
                }
                obj = this.setStep2Val();
                this.apiHit(obj);
                break;
            case 3:
                if (this.child3.isInstruction.value) {
                    this.apiHit({instructions: this.child3.instructions.value});
                }
                this.selectedStep = 4;
                break;
            case 4: {
                this.http.hideModal();
                this.http.openModal('sendEmail', this.modalData);
            }
                this.onClose.next(true);
                break;
        }
        this.http.eventSubject.next({eventType: 'addAppointType', data: obj});
    }

    setStep2Val() {
        const obj: any = this.child2.form.value;
        obj.availability = JSON.stringify(this.child2.availability);
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
        if (this.allData) {
            obj.appointmentId = this.allData._id;
        }
        this.http.postData(ApiUrl.ADD_APPOINTMENT_TYPE, obj).subscribe(res => {
            this.allData = res.data;
        });
    }

    checkDisable() {
        if (this.child1 && this.child1.form && this.selectedStep === 1) {
            if (!this.child1.form.valid) { return true; }
            else if (this.child1.showPatternError) { return true }
            else { return !this.child1.form.valid }
        }
    }

}
