import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {FormGroup, Validators} from '@angular/forms';
import {TableModel} from '../../../shared/models/table.common.model';
import {HttpService} from '../../../services/http.service';
import {ApiUrl} from '../../../services/apiUrls';
import { finalize } from 'rxjs/operators';
import { FileType, MB } from 'src/app/services/constants';
@Component({
    selector: 'app-my-profile',
    templateUrl: './my-profile.component.html',
    styleUrls: ['./my-profile.component.scss'],
})

export class MyProfileComponent implements OnInit {

    @ViewChild('address', {static: false}) address: ElementRef;
    myModel: any;
    loading: boolean;
    isUpdating = false;
    form: FormGroup;
    loginData: any = {};

    constructor(public http: HttpService) {
        this.myModel = new TableModel();
        this.loading = false;
    }


    ngOnInit() {
        this.loginData = this.http.getLoginData();
        const data = this.http.getLoginData();
        this.form = this.http.fb.group({
            title: [data.title || 'Mr.'],
            firstName: [data.firstName || data.name, Validators.required],
            middleName: [data.middleName || ''],
            lastName: [data.lastName, Validators.required],
            imageUrl: [''],
            businessType: [''],
            address1: [data.address1, Validators.required],
            city: [data.city, Validators.required],
            country: [data.country || '', Validators.required],
            postalCode: [data.postalCode, Validators.required],
            state: [data.state, Validators.required],
            phone1: [data.phone1, Validators.required],
            phone2: [data.phone2],
            phone1Type: [data.phone1Type || 'work'],
            phone2Type: [data.phone2Type || 'work'],
            email: [data.email, Validators.compose([Validators.required, Validators.pattern(this.http.CONSTANT.EMAIL_REGEX)])],
            website: [data.website, Validators.pattern(this.http.CONSTANT.URL_REGEX)]

        });
        if (data.imageUrl) {
            this.form.controls.imageUrl.patchValue(JSON.parse(data.imageUrl));
        }
    }

    finalSubmit() {
        if (this.http.isFormValid(this.form)) {
            let formValues = {};
            for (let _o in this.form.controls) {
                if (_o !== "imageUrl") {
                    formValues[_o] = this.form.controls[_o].value.trim();
                }
            }
            this.form.patchValue(formValues);
            const obj: any = JSON.parse(JSON.stringify(this.form.value));
            obj.imageUrl = JSON.stringify(obj.imageUrl);
            this.isUpdating = true;
            this.http.postData(ApiUrl.UPDATE_PROFILE, obj).pipe(finalize(()=>{this.isUpdating = false;})).subscribe(res => {
                this.http.openSnackBar('Updated Successfully');
                this.http.setLoginData(res.data);
            });
        }
    }

    addressDetails(e) {
        if (e) {
            // address2: e.formatted_address,
            this.form.patchValue({
                address1: this.address.nativeElement.value,
                postalCode: e.postal_code,
                country: e.country,
                state: e.state,
                city: e.city
            });
        } else {
            this.form.patchValue({
                address1: '',
                address2: '',
                postalCode: '',
                country: '',
                state: '',
                city: ''
            });
        }
        document.getElementById('myId').click();
    }

    uploadImage(file) {
        if (!this.http.isValidateFileTypeAndSize(file,'image', 5 * MB)) return;
        
        this.loading = true;
        this.http.uploadImage(ApiUrl.UPLOAD_IMAGE, file, false).subscribe(res => {
            this.loading = false;
            this.form.controls.imageUrl.patchValue({
                original: res.data.original,
                thumbnail: res.data.thumbnail,
            });
        }, () => {
            this.loading = false;
        });
    }

    

}
