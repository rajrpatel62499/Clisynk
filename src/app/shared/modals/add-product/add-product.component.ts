import { Subject } from 'rxjs';
import {Component, OnInit} from '@angular/core';
import {FormGroup, Validators} from '@angular/forms';
import {HttpService} from '../../../services/http.service';
import {TableModel} from '../../models/table.common.model';
import {ApiUrl} from '../../../services/apiUrls';

@Component({
    selector: 'app-add-product',
    templateUrl: './add-product.component.html'
})
export class AddProductComponent implements OnInit {

    form: FormGroup;
    myModel: any;
    modalData: any;
    public onClose: Subject<boolean>;


    constructor(public http: HttpService) {
        this.myModel = new TableModel();
    }

    ngOnInit(): void {
        this.formInit();
        if (this.modalData) {
            this.fillValues(this.modalData);
        }
    }

    formInit() {
        this.form = this.http.fb.group({
            name: ['', Validators.required],
            description: [''],
            price: [undefined, Validators.required],
            // quantity: [1, Validators.required]
        });
    }

    fillValues(data) {
        this.form.patchValue({
            name: data.name,
            description: data.description,
            price: data.price,
            // quantity: data.quantity
        });
    }

    finalSubmit() {
        if (this.http.isFormValid(this.form)) {

            if (this.form.value.quantity === 0) {
                return;
            }
            const obj: any = this.form.value;
            this.myModel.loader = true;
            if (this.modalData && this.modalData.fromInvoice) {
                const temp = this.form.value;
                temp.index = this.modalData.index;
                temp._id = this.modalData._id;
                temp.price = parseInt(this.form.value.price);
                this.http.eventSubject.next({eventType: 'editProduct', data: temp});
                this.http.hideModal();
                this.myModel.loader = false;
                this.http.openSnackBar(`Product ${this.modalData ? 'Updated' : 'Added'} Successfully`);
            } else {
                if (this.modalData) {
                    obj.productId = this.modalData._id;
                }
                this.http.postData(ApiUrl.ADD_PRODUCT, obj).subscribe(res => {
                    console.log(res.data, 'data');
                    this.myModel.loader = false;
                    this.onClose ?  this.onClose.next(true) : '';
                    this.http.openSnackBar(`Product ${this.modalData ? 'Updated' : 'Added'} Successfully`);
                    this.http.eventSubject.next({eventType: 'addProduct', data: res.data});
                    this.http.hideModal();
                }, () => {
                    this.myModel.loader = false;
                });
            }
        }
        else { console.log('errrr'); }
    }

}
