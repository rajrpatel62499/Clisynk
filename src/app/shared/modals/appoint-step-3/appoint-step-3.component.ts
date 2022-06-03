import {Component, OnInit, Input} from '@angular/core';
import {HttpService} from '../../../services/http.service';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';

@Component({
    selector: 'app-appoint-3',
    templateUrl: './appoint-step3.component.html'
})
export class AppointStep3Component implements OnInit {

    @Input() inputData: any;
    @Input() isEdit: boolean;
    form: FormGroup;
    isInstruction = new FormControl(false);
    instructions = new FormControl('', Validators.required);

    constructor(public http: HttpService, private fb: FormBuilder) {
        this.form = this.http.fb.group({
            instructions: ['', Validators.required]
        });
    }

    ngOnInit(): void {
        if (this.isEdit) {
            this.fillValues();
        }
    }

    fillValues() {
        if (this.inputData.instructions) {
            this.isInstruction.patchValue(true);
            this.instructions.patchValue(this.inputData.instructions);
        }
    }

}
