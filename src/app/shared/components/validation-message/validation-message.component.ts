import { Component, OnInit, Input } from '@angular/core';
import { AbstractControlDirective, AbstractControl, FormControl } from '@angular/forms';

@Component({
    selector: 'app-validation-message',
    templateUrl: './validation-message.component.html',
    styleUrls: ['./validation-message.component.css']
})
export class ValidationMessageComponent implements OnInit {

    private static readonly errorMessages = {
        email: (params, ctName) => `${ctName} must be a valid email address`,
        required: (params, ctName) => `${ctName} is required`,
        dateRangeInvalid: (params, ctName) => `${ctName} is invalid`,
        minlength: (params) => 'The min number of characters is ' + params.requiredLength,
        maxlength: (params) => 'The max allowed number of characters is ' + params.requiredLength,
        pattern: (params) => 'The required pattern is: ' + params.requiredPattern,
        patternInvalid: (params) => 'The required pattern is: ' + params.regexp,
        years: (params) => params.message,
        countryCity: (params) => params.message,
        uniqueName: (params) => params.message,
        telephoneNumbers: (params) => params.message,
        telephoneNumber: (params) => params.message,
        min: (params) => params.message,
        max: (params) => params.message,
        underAge:(params) => "Age allowed 18+ only.",
    };

    @Input()
    private control: AbstractControlDirective | AbstractControl;

    @Input()
    private messages: any = {};

    @Input()
    private controlName: any;


    constructor() { }

    ngOnInit(): void {
        if (!this.controlName) {
            this.controlName = this.getControlName(this.control as FormControl);
        }
    }

    shouldShowErrors(): boolean {
        const isFormDirty = (this.control as FormControl).parent.dirty;
        return this.control &&
            this.control.errors &&
            ((this.control.touched && this.control.dirty && isFormDirty));
    }

    listOfErrors(): string[] {
        return Object.keys(this.control.errors)
            .map(field => this.getMessage(field, this.control.errors[field]));
    }

    private getControlName(c: AbstractControl): string | null {
        const formGroup = c.parent.controls;
        const controlName = this.prettifyCamelCase(Object.keys(formGroup).find(name => c === formGroup[name]) || null);
        return controlName;
    }

    private getMessage(type: string, params: any) {
        return this.messages[type] || ValidationMessageComponent.errorMessages[type](params, this.controlName);
    }

    private prettifyCamelCase(str) {
        let output = '';
        const len = str.length;
        let char;

        for (let i = 0; i < len; i++) {
            char = str.charAt(i);
            if (i === 0) {
                output += char.toUpperCase();
            } else if (char !== char.toLowerCase() && char === char.toUpperCase()) {
                output += ' ' + char;
            } else if (char === '-' || char === '_') {
                output += ' ';
            } else {
                output += char;
            }
        }
        return output;
    }


}
