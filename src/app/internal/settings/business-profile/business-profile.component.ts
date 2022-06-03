import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {FormGroup, Validators} from '@angular/forms';
import {HttpService} from '../../../services/http.service';
import {ApiUrl} from '../../../services/apiUrls';
import {TableModel} from '../../../shared/models/table.common.model';
import { finalize } from 'rxjs/operators';
import { FileType, MB } from 'src/app/services/constants';

@Component({
    selector: 'app-business-profile',
    templateUrl: './business-profile.component.html'
})

export class BusinessProfileComponent implements OnInit {

    @ViewChild('address', {static: false}) address: ElementRef;

    form: FormGroup;
    myModel: any;
    modalData: any;
    isEdit = false;
    loading = false;
    color1 = '#897870';
    color2 = '#000';
    isUpdating = false;

    constructor(public http: HttpService) {
        this.myModel = new TableModel();
    }

    ngOnInit(): void {
        this.formInit();
        this.addressList();
        this.businessTypesList();
        this.countryList();
    }

    formInit() {
        this.form = this.http.fb.group({
            businessType: [''],
            name: ['', Validators.required],
            address1: ['', Validators.required],
            address2: [''],
            city: ['', Validators.required],
            postalCode: ['', Validators.required],
            country: ['', Validators.required],
            state: ['', Validators.required],
            phone: ['', Validators.required],
            email: ['', Validators.compose([Validators.required, Validators.pattern(this.http.CONSTANT.EMAIL_REGEX)])],
            website: ['', Validators.compose([Validators.pattern(this.http.CONSTANT.URL_REGEX)])],
            imageOriginal: [''],
            imageThumbnail: ['', Validators.required],
            lat: [''],
            long: ['']
        });
    }

    finalSubmit() {
        if (this.form.invalid) {
            console.log(this.form);
            this.http.markFormGroupTouched(this.form);
            let arr = this.http.findInvalidControlsRecursive(this.form);
            this.http.handleError('Please check all required fields');
            return;
        }
        const obj: any = JSON.parse(JSON.stringify(this.form.value));
        if (this.isEdit) {
            obj.addressId = this.modalData._id;
        }
        if (this.http.isFormValid(this.form)) {
            this.isUpdating = true;
            this.http.postData(ApiUrl.ADD_ADDRESS, obj).pipe(finalize(()=> {this.isUpdating = false})).subscribe(() => {
                this.http.openSnackBar('Profile Updated Successfully');
            }, () => {
            });
        }
    }

    businessTypesList() {
        this.http.getData(ApiUrl.BUSINESS_LIST_TYPE, {}).subscribe(res => {
            this.myModel.businessTypes = res.data;
            console.log(this.myModel.businessTypes);
            
        });
    }

    countryList(country?) {
        const obj: any = {};
        if (country) {
            obj.country = country;
        }
        this.http.getData(ApiUrl.COUNTRY_STATE, obj).subscribe(res => {
            if (country) {
                this.myModel.states = res.data;
                if (this.isEdit) {
                    res.data.forEach((val) => {
                        if (val.state_name === this.modalData.state) {
                            this.form.controls.state.patchValue(val.state_name);
                        }
                    });
                }
            } else {
                this.myModel.countries = res.data;
                if (this.isEdit) {
                    res.data.forEach((val) => {
                        if (val.country_name === this.modalData.country) {
                            this.form.controls.country.patchValue(val.country_name);
                        }
                    });
                    this.countryList(this.form.value.country);
                }
            }
        });
    }

    addressList() {
        this.http.getData(ApiUrl.ADDRESS_LIST, {}).subscribe((res) => {
            if (res.data.length) {
                this.isEdit = true;
                this.modalData = res.data[0];

                this.fillValues();
            }
        });
    }

    fillValues() {
        this.form.patchValue({
            name: this.modalData.name,
            address1: this.modalData.address1,
            address2: this.modalData.address2,
            website: this.modalData.website,
            phone: this.modalData.phone,
            email: this.modalData.email,
            postalCode: this.modalData.postalCode,
            city: this.modalData.city,
            lat: this.modalData.lat,
            long: this.modalData.long,
            businessType: this.modalData.businessType
        });

        if (this.modalData.imageUrl && this.modalData.imageUrl.original) {
            this.form.patchValue({
                imageOriginal: this.modalData.imageUrl.original,
                imageThumbnail: this.modalData.imageUrl.thumbnail
            });
        }
    }

    uploadImage(file) {
        if (!this.http.isValidateFileTypeAndSize(file, 'image', 5 * MB)) return;
        this.loading = true;
        this.http.uploadImage(ApiUrl.UPLOAD_IMAGE, file, false).subscribe(res => {
            this.loading = false;
            this.form.patchValue({
                imageOriginal: res.data.original,
                imageThumbnail: res.data.thumbnail
            });
        }, () => {
        });
    }

    addressDetails(e) {
        // address2: e.formatted_address,
        if (e) {
            this.form.patchValue({
                address1: this.address.nativeElement.value,
                lat: e.lat,
                long: e.lng,
                postalCode: e.postal_code,
                country: e.country,
                state: e.state,
                city: e.city
            });
        } else {
            this.form.patchValue({
                address1: '',
                address2: '',
                lat: '',
                long: '',
                postalCode: '',
                country: '',
                state: '',
                city: ''
            });
        }
        document.getElementById('myId').click();
    }

}
