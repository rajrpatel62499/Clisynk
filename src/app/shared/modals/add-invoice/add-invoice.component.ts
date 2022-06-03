import { AddContactComponent } from './../add-contact/add-contact.component';
import {ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, NgZone, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {HttpService} from '../../../services/http.service';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {ApiUrl} from '../../../services/apiUrls';
import {TableModel} from '../../models/table.common.model';
import {DeleteComponent} from '../delete/delete.component';
import {Subject} from 'rxjs';
import {ContactDetailsComponent} from '../contact-details/contact-details.component';

@Component({
    selector: 'app-add-invoice',
    templateUrl: './add-invoice.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush

})
export class AddInvoiceComponent implements OnInit, OnDestroy {

    hidePrint = false;
    isView = false;
    form: FormGroup;
    modalData: any;
    myModel: TableModel;
    selected: any;
    selectedContact: any;
    isSelected = false;
    myControl = new FormControl('', Validators.required);
    subTotal = 0;
    myResponse: any = [];
    isEdit = false;
    total = 0;
    showDiscount = 0;
    showDeposit = 0;
    amountPaid = 0;
    searchText: string = "";
    

    constructor(public http: HttpService, private cd: ChangeDetectorRef, public ngZone: NgZone) {
        this.myModel = new TableModel();
        this.myModel.subscription = this.http.eventStatus.subscribe(data => {
            if (data && data.eventType === 'addProduct') {
                if (data.data) {
                    this.myResponse.items[data.data.index] = data.data;
                    this.selectProduct(data.data);
                    this.subTotalCal();
                    // this.finalSubmit();
                }
            } else if (data && data.eventType === 'editProduct') {
                this.myResponse.items[data.data.index] = data.data;
                this.subTotalCal();
                this.finalSubmit();

            } else if (data && data.eventType === 'addContact') {
                this.contactList();
            }
        });
        this.myResponse.items = [];
    }

    ngOnInit(): void {
        this.addressList();
        if (this.modalData && this.modalData.type === 1) {
            this.myModel.heading = 'invoice';
        } else {
            this.myModel.heading = 'quote';
        }
        this.formInit();
        this.contactList();
        if (this.modalData.contactId) {
            this.isEdit = true;
            this.fillValues();
        } else {
            this.productList();
        }
    }

    ngOnDestroy(): void {
        this.myModel.subscription.unsubscribe();
    }

    openDetails() {
        this.http.showModal(ContactDetailsComponent, 'md', this.selectedContact);
    }

    convertToInvoice() {
        const obj: any = {
            quoteId: this.myResponse._id
        };
        this.http.postData(ApiUrl.CONVERT_TO_INVOICE, obj).subscribe(res => {
            this.http.hideModal();
            this.http.openModal('addInvoice', res.data);
        }, () => {
        });
    }

    notify(payload: string) {
        this.http.openSnackBar('Link copied successfully');
    }

    fillValues() {
        this.myModel.loader = true;
        this.myResponse = this.modalData;
        const obj = {
            invoiceQuoteId: this.modalData._id
        };
        this.http.getData(ApiUrl.INVOICE_DETAILS, obj).subscribe(res => {
            this.myModel.loader = false;
            this.myResponse = res.data;
            console.log(this.myResponse);
            this.productList();

            this.form.patchValue({
                terms: res.data.terms,
                notes: res.data.notes,
                dueBy: new Date(res.data.dueBy),
                acceptOnlinePayment: res.data.acceptOnlinePayment
            });

            if (res.data.acceptOnlinePayment) {
                this.form.controls.bankDetails.patchValue(res.data.bankDetails);
            }

            if (res.data.isDiscount) {
                this.form.patchValue({
                    discountType: res.data.discountType.toString(),
                    discountValue: res.data.discountValue,
                    isDiscount: res.data.isDiscount
                });
            }

            if (res.data.isDeposit) {
                this.form.patchValue({
                    isDeposit: res.data.isDeposit,
                    depositValue: res.data.depositValue,
                    depositType: res.data.depositType.toString()
                });
            }
            this.selectedContact = res.data.contactId;
            this.myControl.patchValue(res.data.contactId);
            this.form.controls.contactId.patchValue(res.data.contactId._id);
            if (this.myResponse.status !== 'Draft') {
                this.isView = true;
            }
            this.selected = res.data.addressId;
            this.getTotalAmount();

            if (res.data.payments.length > 0) {
             this.getAmountPaid(res.data.payments);
            }

            if (this.myResponse.status === 'Paid' && res.data.payments.length === 0) {
                this.amountPaid = this.myResponse.total;
                this.total = 0;
            }
        });
    }

    getTotalAmount() {

        this.total = this.myResponse.total;

        let subTotal = 0;
        this.myResponse.items.forEach((val) => {
            subTotal = subTotal + (val.price * val.quantity);
        });
        this.subTotal = subTotal;

        if (this.myResponse.isDiscount) {
            if (this.myResponse.discountType === 1) {
                this.showDiscount = (this.myResponse.discountValue / 100) * subTotal;
            } else {
                this.showDiscount = this.form.value.discountValue;
            }
        }

        if (this.myResponse.isDeposit) {
            if (this.myResponse.depositType === '1' || this.myResponse.depositType === 1) {
                this.showDeposit = (this.myResponse.depositValue / 100) * this.total;
            } else {
                this.showDeposit = this.myResponse.depositValue;
            }
        }

    }

    getAmountPaid(payments) {
        this.amountPaid = 0;
        payments.forEach((val) => {
            if (val.status === 1) {
                this.amountPaid = this.amountPaid + val.amount;
            }
        });
    }

    formInit() {
        this.form = this.http.fb.group({
            type: [this.modalData.type],
            notes: [''],
            terms: [''],
            discountValue: [10],
            discountType: ['1'],
            isDiscount: [false],
            depositValue: [10],
            depositType: ['1'],
            isDeposit: [false],
            acceptOnlinePayment: [false],
            contactId: ['', Validators.required],
            dueBy: [new Date(), Validators.required],
            bankDetails: ['']
        });

      this.form.get('acceptOnlinePayment').valueChanges.subscribe(res => {
          console.log(res);
          if (res) {
              this.form.get('bankDetails').setValidators([Validators.required])
            } else {
              this.form.get('bankDetails').clearValidators();
          }
        this.form.get('bankDetails').updateValueAndValidity();
      })
    }


    closeAction() {
        const res = this.finalSubmit();
        if(res == 'open') {
            return;
        }
        this.http.hideModal();
        const money = document.getElementById('money_container');
        if(money){
            money.style.display = 'block';
        }
    }

    selectProduct(data) {
        data.quantity = 1;
        this.myResponse.items.push(data);
        const index = this.myModel.products.findIndex(x => x.name === data.name);
        if (index > -1) {
            this.myModel.products.splice(index, 1);
        }
        this.subTotalCal();
        this.finalSubmit();
    }

    subTotalCal() {
        this.subTotal = 0;
        this.total = 0;
        this.myResponse.items.forEach((val) => {
            this.total = this.total + (val.price * val.quantity);
            this.subTotal = this.subTotal + (val.price * val.quantity);
        });

        if (this.form.value.isDiscount) {
            if (this.form.value.discountType === '1' || this.form.value.discountType === 1) {
                this.showDiscount = (this.form.value.discountValue / 100) * this.subTotal;
                this.total = this.total - this.showDiscount;
            } else {
                this.showDiscount = this.form.value.discountValue;
                this.total = this.total - this.showDiscount;
            }
        }

        if (this.form.value.isDeposit) {
            if (this.form.value.depositType === '1' || this.form.value.depositType === 1) {
                this.showDeposit = (this.form.value.depositValue / 100) * this.total;
            } else {
                this.showDeposit = this.form.value.depositValue;
            }
        }

        this.cd.markForCheck();
    }

    finalSubmit(next?) {
        if(this.form.invalid) {
            let arr: string[] = this.http.findInvalidControlsRecursive(this.form);
            console.log(arr);
            if (arr.includes('bankDetails')) {
                this.http.handleError("Please fill the bank details");
            }
            return;
        }
        if(this.myControl.invalid) {
            this.http.handleError("Please select the contact");
            return 'open';
        }
        const money = document.getElementById('money_container');
        if(money){
            money.style.display = 'block';
        }

        
        if (this.form.value.contactId && this.myResponse.items.length && this.myResponse.status !== 'Paid' && this.myResponse.status!== 'Refunded') {

            const obj: any = JSON.parse(JSON.stringify(this.form.value));
            const temp: any = [];
            this.myResponse.items.forEach((val) => {
                temp.push({
                    description: val.description,
                    name: val.name,
                    price: val.price,
                    quantity: val.quantity
                });
            });

            if (temp.length) {
                obj.items = JSON.stringify(temp);
            }
            if (obj.isDeposit) {
                obj.isDeposit = true;
            } else {
                obj.isDeposit = false;
                delete obj.depositType;
                delete obj.depositValue;
            }
            if (obj.isDiscount) {
                obj.isDiscount = true;
            } else {
                obj.isDiscount = false;
                delete obj.discountType;
                delete obj.discountValue;
            }

            obj.total = this.total;
            obj.addressId = this.selected._id;

            if (this.myResponse) {
                obj.invoiceQuoteId = this.myResponse._id;
            }

            this.http.postData(ApiUrl.ADD_INVOICE, obj).subscribe(res => {
                this.myResponse = res.data;
                if (next) {
                    this.http.hideModal();
                    const tempObj = {
                        email: this.selectedContact.email,
                        _id: this.selectedContact._id,
                        subject: res.data.subject,
                        html: res.data.html,
                        invoiceQuoteId: this.myResponse._id
                    };
                    this.http.openModal('sendEmail', tempObj);
                } else {
                    this.http.openSnackBar(this.myModel.heading + ' updated');

                    if (res.data.payments.length > 0)
                    this.getAmountPaid(res.data.payments);
                }
                this.http.eventSubject.next({eventType: 'addInvoice'});
            }, () => {
            });
        }
        else{
            if(!next) {

            } else {
                this.http.hideModal();
            }
        }
    }

    addressList() {
        this.http.getData(ApiUrl.ADDRESS_LIST, {}).subscribe((res) => {
            this.ngZone.run(() => {
                this.myModel.addresses = res.data || [];
                this.selected = this.myModel.addresses[0];
            });
            this.cd.detectChanges();
        });
    }

    contactList() {
        const obj: any = {
            skip: 0,
            limit: 1000
        };
        this.http.getData(ApiUrl.CONTACTS, obj).subscribe(res => {
                this.myModel.contacts = res.data.data;
                console.log(this.myModel.contacts);
                if (this.isEdit) {
                    res.data.data.forEach((val) => {
                        if (this.modalData.contactId._id === val._id) {
                            this.selectedContact = val;
                            this.myControl.patchValue(val.firstName);
                            this.form.controls.contactId.patchValue(val._id);
                        }
                    });
                }
            },
            () => {
            });
    }

    productList() {
        this.http.getData(ApiUrl.PRODUCTS, {}).subscribe(res => {
                this.myModel.products = res.data;
                if (this.isEdit) {
                    for (let key of this.myResponse.items) {
                        const index = this.myModel.products.findIndex(x => x.name === key.name);
                        if (index > -1) {
                            this.myModel.products.splice(index, 1);
                        }
                    }
                }
            },
            () => {
            });
    }

    finalSelected() {
        this.isSelected = true;
        if (this.myControl.value) {
            const temp = JSON.parse(JSON.stringify(this.myControl.value));
            this.selectedContact = temp;
            this.form.controls.contactId.patchValue(temp._id);
        }
    }

    clearSearch() {
        if (!this.isSelected) {
            this.myControl.patchValue('');
        }
    }

    saveDiscount() {
        if (this.form.value.isDiscount) {
            if (this.form.value.discountType === '1' || this.form.value.discountType === 1) {
                this.showDiscount = (this.form.value.discountValue / 100) * this.subTotal;
            } else {
                this.showDiscount = this.form.value.discountValue;
            }
            this.total = this.subTotal - (this.showDiscount ? this.showDiscount : 0);
        }
        this.saveDeposit();
        // this.finalSubmit();
    }

    removeDiscount() {
        this.form.controls.isDiscount.patchValue(false);
        this.subTotalCal();
        this.saveDeposit();
        this.showDiscount = 0;
    }

    saveDeposit() {
        if (this.form.value.isDeposit) {
            if (this.form.value.depositType === '1' || this.form.value.depositType === 1) {
                this.showDeposit = (this.form.value.depositValue / 100) * this.total;
            } else {
                this.showDeposit = this.form.value.depositValue;
            }
        }
        this.finalSubmit();
    }

    removeDeposit() {
        this.form.controls.isDeposit.patchValue(false);
        this.subTotalCal();
        this.finalSubmit();
        this.showDeposit = 0;
    }

    printFile() {
        // document.getElementById('myId').click();
        // this.isView = true;
        this.hidePrint = true;
        const that = this;
        // window.print();
        setTimeout(() => {
            this.setHideValue(that);
            window.focus(); // necessary for IE >= 10*/
            window.print();
            window.close();
        }, 1000);
    }

    downloadPdf() {
        // var data = document.getElementById('add_invoice_form');
        // html2canvas(data).then(canvas => {
        // // Few necessary setting options
        // var imgWidth = 208;
        // var pageHeight = 295;
        // var imgHeight = canvas.height * imgWidth / canvas.width;
        // var heightLeft = imgHeight;
        
        // const contentDataURL = canvas.toDataURL('image/png')
        // let pdf = new jspdf('p', 'mm', 'a4'); // A4 size page of PDF
        // var position = 0;
        // pdf.addImage(contentDataURL, 'PNG', 0, position, imgWidth, imgHeight)
        // pdf.save('new-file.pdf'); // Generated PDF
        // });
    }

    setHideValue(that) {
        setTimeout(() => {
            that.hidePrint = false;
            that.cd.markForCheck();
        }, 1000);
    }

    deleteInvoice() {
        const obj: any = {
            type: 8,
            key: 'id',
            title: `Are you sure you want to delete this ${this.myModel.heading}?`,
            message: 'Any payments made to this invoice will also be deleted.',
            id: this.myResponse._id
        };

        if (this.myResponse.type === 2) {
            obj.type = 9;
            delete obj.message;
        }

        const modalRef = this.http.showModal(DeleteComponent, 'xs', obj);
        modalRef.content.onClose = new Subject<boolean>();
        modalRef.content.onClose.subscribe(() => {
            this.http.eventSubject.next({eventType: 'addInvoice'});
            this.http.hideModal();
            this.http.openSnackBar(this.myModel.heading + ' has been deleted');
        });
    }

    deleteProduct(data, index) {
        this.myModel.products.push(data);
        this.myResponse.items.splice(index, 1);
        this.subTotalCal();
    }

    editProduct(data, index) {
        data.index = index;
        data.fromInvoice = true;
        this.http.openModal('addProduct', data);
        this.subTotalCal();
    }

}
