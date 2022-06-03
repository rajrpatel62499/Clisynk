import {Component, Input, Output, EventEmitter, OnChanges, SimpleChanges, ViewChild, ElementRef} from '@angular/core';
import {HttpService} from '../../../services/http.service';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {appointMentList, URL_REGEX} from '../../../services/constants';
import {ApiUrl} from '../../../services/apiUrls';
import {AppointmentService} from '../../../internal/appointments/appointment.service';

@Component({
    selector: 'app-appoint-1',
    templateUrl: './appoint-step1.component.html'
})
export class AppointStep1Component implements OnChanges {

    @Input() inputData: any;
    @Input() isEdit: boolean;
    @Output() outputAction: EventEmitter<any> = new EventEmitter<any>();
    form: FormGroup;
    radioSelected: string;
    showItems: any = [];
    @ViewChild('address', {static: false}) address: ElementRef;
    inputForm = new FormControl('', Validators.required);
    showPatternError = false;
    linkVal = false;

    constructor(public http: HttpService, public appoint: AppointmentService) {
        this.form = this.http.fb.group({
            name: ['', Validators.required],
            notExist: [true, Validators.required],
            inputVal: ['', Validators.required],
            selectedLoc: [undefined, Validators.required]
        });
        this.radioSelected = undefined;
        this.inputForm.valueChanges.subscribe(data => {
            if (data) {
                this.form.controls.inputVal.patchValue('data');
            } else {
                this.form.controls.inputVal.patchValue('');
            }
        });
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (this.inputData) {
            this.fillValues();
        }
    }

    fillValues() {
        this.form.patchValue({
            name: this.inputData.name,
            selectedLoc: this.inputData.location ? this.inputData.location.type : 1
        });
        this.radioSelected = this.inputData.location ? this.inputData.location.radioSelected : 1;
        if (this.inputData.location) {
            this.changeLoc(this.inputData.location.type);
        }
    }

    changeName() {
        if (this.linkVal) {
            this.form.controls.name.patchValue(this.http.loginData.company);
        } else {
            this.form.controls.name.patchValue('');
        }
    }

    changeLoc(flag) {
        this.form.controls.selectedLoc.patchValue(flag);
        this.showItems = appointMentList.filter(val => val.type === flag);

        this.showItems.forEach((val) => {
            val.input = '';
        });

        if (this.inputData.location) {
            if (flag == 1 && this.inputData.location.input) {
                this.showItems[0].input = this.inputData.location.input;
            }
        }

    }

    patternCheck (data) {
        this.showPatternError = false;
        if(data.radioSelected === 1) {
            let res  = data.input.match(URL_REGEX);
            if(!res){
                this.showPatternError= true;
            }
        }
    }

    checkUnique(val) {
        const obj: any = {
            name: val
        };
        if (this.inputData) {
            obj.appointmentId = this.inputData._id;
        }
        if (val) {
            this.http.getData(ApiUrl.CHECK_UNIQUE, obj).subscribe(res => {
                this.form.controls.notExist.patchValue(true);
            }, () => {
                this.form.controls.notExist.patchValue('');
            });
        }
    }

    setVal() {
        this.showItems[0].input = this.address.nativeElement.value;
    }

    addressDetails(e) {
        localStorage.setItem('selectedAddress', this.address.nativeElement.value);
        if (this.radioSelected == '5') {
            this.showItems[0].input = localStorage.getItem('selectedAddress');
        }
    }

    checkVal(data) {
        this.showPatternError = false;
        if (data.isInput) {
            this.form.controls['inputVal'].setValidators([Validators.required]);
            this.form.controls['inputVal'].updateValueAndValidity();
        } else {
            this.form.controls['inputVal'].setValidators([]);
            this.form.controls['inputVal'].updateValueAndValidity();
        }
    }

}
