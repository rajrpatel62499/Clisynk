import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {HttpService} from '../../services/http.service';
import {ApiUrl} from '../../services/apiUrls';
import {TableModel} from '../../shared/models/table.common.model';

@Component({
    selector: 'app-receipt',
    templateUrl: './receipt.component.html',
    styleUrls: ['./receipt.component.css']
})
export class ReceiptComponent implements OnInit {

    myModel: any;
    allData: any = [];
    showText = 'Invoice';
    subTotal = 0;
    showDiscount = 0;
    showSubTotal = 0;
    showDeposit = 0;
    amountPaid = 0;
    removePrint = false;

    constructor(public activeRoute: ActivatedRoute, public http: HttpService) {
        this.myModel = new TableModel();
        activeRoute.queryParams.subscribe(params => {
            this.myModel.id = params['id'];
            this.myModel.type = params['type'];
            if (this.myModel.type === 1 || this.myModel.type === '1') {
                this.showText = 'Invoice';
            } else {
                this.showText = 'Quote';
            }
        });
    }

    ngOnInit() {
        this.getInvoice();
    }

    getInvoice() {
        this.subTotal = 0;
        const obj = {
            invoiceQuoteId: this.myModel.id,
            fromReceipt: true
        };
        this.http.getData(ApiUrl.INVOICE_DETAILS, obj).subscribe(res => {
            this.allData = {...res.data};
            this.showSubTotal = res.data.total;

            this.allData.items.forEach((val) => {
                this.subTotal = this.subTotal + (val.price * val.quantity);
            });
            this.showDiscount = this.allData.discountType === 1 ? this.subTotal * (this.allData.discountValue / 100)
                    : this.allData.discountValue;

            this.allData.total =  (this.subTotal - this.showDiscount);

            this.showDeposit = this.allData.depositType === 1 ? this.allData.total * (this.allData.depositValue / 100)
                : this.allData.depositValue;
            this.allData.payments.forEach((val) => {
                if (val.status === 1) {
                    this.amountPaid = this.amountPaid + val.amount;
                }
            });

            if (this.allData.status === 'Paid' && this.allData.payments.length === 0) {
                this.amountPaid = this.allData.total;
                this.allData.total = 0;
            }
        });
    }

    acceptQuote() {
        const obj = {
            invoiceQuoteId: this.myModel.id,
            type: this.myModel.type
        };
        this.http.postData(ApiUrl.ACCEPT_QUOTE, obj).subscribe(res => {
            this.allData.status = res.data.status;
            this.http.openSnackBar('Accepted Successfully');
        }, () => {
        });
    }

    printFile() {
        this.removePrint = true;
        const that = this;
        setTimeout(function () {
            that.removePrint = false;
            window.print();
        }, 1500);
    }

}
