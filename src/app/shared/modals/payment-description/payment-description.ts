import {Component} from '@angular/core';
import {HttpService} from '../../../services/http.service';
import {ApiUrl} from '../../../services/apiUrls';

@Component({
    selector: 'app-payment-description',
    templateUrl: './payment-description.html'
})
export class PaymentDescriptionComponent {

    myModel: any;
    modalData: any;

    constructor(public http: HttpService) {
    }

    openRefund(template) {
        this.http.showModal(template, 'xs');
    }

    makeRefund() {
        this.http.hideModal();
        const obj = {
            id: this.modalData.invoiceQuoteId._id,
            contactId: this.modalData.contactId._id,
            type: 2,
            status: 2
        };
        this.http.postData(ApiUrl.ADD_PAYMENT, obj).subscribe(() => {
            this.http.hideModal();
            this.http.eventSubject.next({eventType: 'addPayment'});
            this.http.openModal('successModal', {flag: 1});
        }, () => {
        });
    }

}
