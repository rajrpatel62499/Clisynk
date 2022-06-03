import {Component, OnInit} from '@angular/core';
import {TableModel} from '../../models/table.common.model';
import {HttpService} from '../../../services/http.service';
import {ApiUrl} from '../../../services/apiUrls';
import {Subject} from 'rxjs';
import {FormGroup, Validators} from '@angular/forms';
import {AddContactComponent} from '../add-contact/add-contact.component';
import * as moment from 'moment';

@Component({
    selector: 'app-add-payment',
    templateUrl: './add-payment.component.html'
})
export class AddPaymentComponent implements OnInit {

    myModel: TableModel;
    modalData: any;
    public form: FormGroup;
    public onClose: Subject<boolean>;
    nameHeading = 'Payment reference';
    addPaymentOptions: any = [
        {name: 'Select a product', dropdownType: 'main', type : 1, goTo: 'product'},
        {name: 'Select an invoice', dropdownType: 'main', type : 2, goTo: 'invoice'},
        {name: 'Select a product', dropdownType: 'product', isHeading: true, goTo: 'main'},
        {name: 'Select an invoice', dropdownType: 'invoice', isHeading: true, goTo: 'main'}
    ];
    dropdownType = 'main';
    amount = 0;
    typeToSend = 1;
    sortBy: any = '';

    constructor(public http: HttpService) {
        this.myModel = new TableModel();
        this.myModel.subscription = this.http.eventStatus.subscribe(data => {
            if (data && data.eventType === 'addProduct') {
            }
        });
    }

    ngOnInit(): void {
        this.formInit();
        this.contactList();
        this.productList();
        this.invoiceList();
    }

    formInit() {
        this.form = this.http.fb.group({
            contactId: ['', Validators.required],
            type: [1, Validators.required],
            id: ['', Validators.required],
            amount: [100, Validators.required],
            status: [1, Validators.required],
            sendReceipt: [false, Validators.required],
            firstName: ['']
        });
        if (this.modalData && this.modalData.contactData) {
            this.form.controls.contactId.patchValue(this.modalData.contactData._id);

            if (this.modalData.contactData.lastName) {
                this.form.controls.firstName.patchValue(this.modalData.contactData.firstName + ' ' + this.modalData.contactData.lastName);
            } else {
                this.form.controls.firstName.patchValue(this.modalData.contactData.firstName);
            }
        } else {
            this.addPaymentOptions.splice(1, 1);
        }

    }

    contactList() {
        const obj: any = {
            skip: this.myModel.currentPage * 100,
            limit: this.myModel.limit
        };
        this.http.getData(ApiUrl.CONTACTS, obj).subscribe(res => {
                    this.myModel.contacts = res.data.data;
                    this.myModel.totalItems = res.data.totalCount;
                },
                () => {
                });
    }

    productList() {
        this.http.getData(ApiUrl.PRODUCTS, {}).subscribe(res => {
                    this.myModel.products = res.data;
                    if (this.modalData && this.modalData.newProduct) {
                        this.form.controls.id.patchValue(res.data[0]);
                    }
                    res.data.forEach((val) => {
                        val.dropdownType = 'product';
                        this.addPaymentOptions.push(val);
                    });
                },
                () => {
                });
    }

    invoiceList() {
        const query = {
            type: 1,
            contactId: this.form.value.contactId._id || this.modalData ? this.modalData.contactData._id : undefined,
            search: 'Draft'
        };
        this.http.getData(ApiUrl.QUOTES_LIST, query).subscribe((res) => {
            this.myModel.allData = res.data;
            res.data.data.forEach((val) => {
                val.dropdownType = 'invoice';
                val.name = `Invoice #${val.srNo}, with $${val.total} due ${moment(val.dueBy).format('MMM DD,YYYY')}`;
                this.addPaymentOptions.push(val);
            });

        }, () => {
        });
    }

    openAddContact() {
        this.http.hideModal();
        this.http.showModal(AddContactComponent, 'new-md', {});
    }

    finalSubmit() {
        if (this.http.isFormValid(this.form)) {
            this.http.hideModal();
            const obj = {...this.form.value};
            obj.id = this.form.value.id;
            obj.contactId = this.form.value.contactId._id || this.modalData.contactData._id;
            obj.type = this.typeToSend;
            obj.amount = this.amount;
            delete obj.firstName;
            this.http.postData(ApiUrl.ADD_PAYMENT, obj).subscribe(() => {
                this.http.openSnackBar('Added successfully');
                this.http.eventSubject.next({eventType: 'addPayment'});
            }, () => {
            });
        }
    }

    dropChanged(data) {
        if (data) {
            this.amount = data.price || data.total;
            this.typeToSend = data.dropdownType === 'invoice' ? 2 : 1;
            this.form.controls.id.patchValue(data._id);
            this.nameHeading = data.name;
        }
    }

    changeType(data) {
        if (data.isHeading) {
            this.dropdownType = 'main';
        } else {
            if (this.dropdownType === 'invoice') {
                this.sortBy = data.val;
            } else {
                this.sortBy = '';
            }
            this.dropChanged(data);
        }
    }

    changeFilter(data) {
        if (data.isHeading) {
            this.dropdownType = 'main';
        } else {
            this.sortBy = '';
            this.dropChanged(data);
        }
    }

}
