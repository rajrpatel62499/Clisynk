import { MB } from './../../../services/constants';
import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators } from '@angular/forms';
import { HttpService } from '../../../services/http.service';
import { TableModel } from '../../models/table.common.model';
import { ApiUrl } from '../../../services/apiUrls';

@Component({
    selector: 'app-add-address',
    templateUrl: './add-address.component.html'
})
export class AddAddressComponent implements OnInit {

    form: FormGroup;
    myModel: any;
    modalData: any;
    loading = false;
    isEdit = false;

    constructor(public http: HttpService) {
        this.myModel = new TableModel();
    }

    ngOnInit(): void {
        this.formInit();
        if (this.modalData) {
            this.isEdit = true;
            this.fillValues();
        }
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
            phone: [''],
            email: ['', Validators.compose([Validators.required, Validators.pattern(this.http.CONSTANT.EMAIL_REGEX)])],
            website: ['', Validators.compose([Validators.pattern(this.http.CONSTANT.URL_REGEX)])],
            imageOriginal: [''],
            imageThumbnail: ['', Validators.required],
            lat: [''],
            long: ['']
        });
    }

    finalSubmit() {
        const obj: any = JSON.parse(JSON.stringify(this.form.value));
        if (this.isEdit) {
            obj.addressId = this.modalData._id;
        }
        if (this.http.isFormValid(this.form)) {
            this.http.hideModal();
            this.http.postData(ApiUrl.ADD_ADDRESS, obj).subscribe(() => {
                if (this.isEdit) {
                    this.http.openSnackBar('Address Updated Successfully');
                } else {
                    this.http.openSnackBar('Address Added Successfully');
                }
                this.http.eventSubject.next({ eventType: 'addAddress' });
            }, () => {
            });
        }
    }

    businessTypesList() {
        this.http.getData(ApiUrl.BUSINESS_LIST_TYPE, {}).subscribe(res => {
            this.myModel.businessTypes = res.data;
            if (this.isEdit) {
                res.data.forEach((val) => {
                    if (val.value === this.modalData.businessType) {
                        this.form.controls.businessType.patchValue(val.value);
                    }
                });
            } else {
                this.form.controls.businessType.patchValue(res.data[0].value);
            }
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
            long: this.modalData.long
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
        }, (err) => {
            this.loading = false;
        });
    }

    addressDetails(e) {
        if (e) {
            this.form.patchValue({
                address1: e.formatted_address,
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
