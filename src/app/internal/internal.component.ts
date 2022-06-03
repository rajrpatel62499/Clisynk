import { CreateDocumentComponent } from './../shared/modals/create-document/create-document.component';
import {Component, OnDestroy} from '@angular/core';
import {Router} from '@angular/router';
import 'rxjs-compat/add/operator/filter';
import 'rxjs-compat/add/operator/map';
import {HttpService} from '../services/http.service';
import {Subscription} from 'rxjs';
import {AddContactComponent} from '../shared/modals/add-contact/add-contact.component';
import {AddTaskComponent} from '../shared/modals/add-task/add-task.component';
import {ReviewPopupComponent} from '../shared/modals/review-popup/review-popup.component';
import {SendEmailComponent} from '../shared/modals/send-email/send-email.component';
import {AddNoteComponent} from '../shared/modals/add-note/add-note.component';
import {ImportContactComponent} from '../shared/modals/import-contact/import-contact.component';
import {EmailDetailComponent} from '../shared/modals/email-detail/email-detail.component';
import {ContactListsComponent} from '../shared/modals/contact-lists/contact-lists.component';
import {AddAppointmentComponent} from '../shared/modals/add-appointment/add-appointment.component';
import {AddPaymentComponent} from '../shared/modals/add-payment/add-payment.component';
import {AddInvoiceComponent} from '../shared/modals/add-invoice/add-invoice.component';
import {AddAddressComponent} from '../shared/modals/add-address/add-address.component';
import {AddProductComponent} from '../shared/modals/add-product/add-product.component';
import {PaymentDescriptionComponent} from '../shared/modals/payment-description/payment-description';
import {SuccessModalComponent} from '../shared/modals/success-modal/success-modal.component';
import {AddPipelineComponent} from '../shared/modals/add-pipeline/add-pipeline.component';
import {AddDealComponent} from '../shared/modals/add-deal/add-deal.component';
import {DealDetailsComponent} from '../shared/modals/deal-details/deal-details.component';
import {MoveDealModalComponent} from '../shared/modals/move-deal-modal/move-deal-modal.component';
import {AddPipelineTaskComponent} from '../shared/modals/add-pipeline-task/add-pipeline-task.component';
import {AutoConfigComponent} from '../shared/modals/auto-config/auto-config.component';
import {CancelConfirmComponent} from '../shared/modals/cancel-confirm/cancel-confirm.component';
import {AppointBookComponent} from '../shared/modals/appoint-book/appoint-book.component';
import {DealNoteComponent} from '../shared/modals/deal-note/deal-note.component';
import {AddTagComponent} from '../shared/modals/add-tag/add-tag.component';
import {AppointSuccessComponent} from '../shared/modals/appoint-success/appoint-success.component';
// import {ChangePasswordComponent} from './settings/change-password/change-password.component';
// import { SubmitfeedbackComponent } from '../shared/modals/submitfeedback/submitfeedback.component';
import { CreateWorkspaceComponent } from '../shared/modals/create-workspace/create-workspace.component';
import { MergeContactsComponent } from '../shared/modals/merge-contacts/merge-contacts.component';

@Component({
    selector: 'app-internal',
    templateUrl: './internal.component.html'
})
export class InternalComponent implements OnDestroy {

    subscription: Subscription;
    subscription1: Subscription;
    loading = true;

    public constructor(public router: Router, public http: HttpService) {
        this.subscription = this.http.modalStatus.subscribe(modalName => {
            this.openPopup(modalName);
        });
        this.subscription1 = this.http.loaderStatus.subscribe(status => {
            this.loading = status;
        });
    }

    ngOnDestroy(): void {
        this.subscription.unsubscribe();
        this.subscription1.unsubscribe();
    }

    openPopup(data) {
        if (data) {
            const obj: any = {};
            switch (data.name) {
                case 'addContact':
                    this.http.showModal(AddContactComponent, 'md');
                    break;
                case 'addDocument':
                    this.http.showModal(CreateDocumentComponent, 'md');
                    break;
                case 'addTask':
                    this.http.showModal(AddTaskComponent, 'md', data.data);
                    break;
                case 'reviewPopup':
                    this.http.showModal(ReviewPopupComponent, 'md');
                    break;
                case 'sendEmail':
                    this.http.showModal(SendEmailComponent, 'md', data.data);
                    break;
                case 'addNote':
                    this.http.showModal(AddNoteComponent, 'md');
                    break;
                case 'importContact':
                    this.http.showModal(ImportContactComponent, 'md');
                    break;
                case 'emailDetail':
                    this.http.showModal(EmailDetailComponent, 'lg', data.data);
                    break;
                case 'contactLists':
                    this.http.showModal(ContactListsComponent, 'more-lg', data.data);
                    break;
                case 'appointment':
                    this.http.showModal(AddAppointmentComponent, 'more-lg');
                    break;
                case 'addPayment':
                    this.http.showModal(AddPaymentComponent, 'md', data.data);
                    break;
                case 'addInvoice':
                    if (data && data.data) {
                        this.http.showModal(AddInvoiceComponent, 'full-screen', data.data);
                    } else {
                        obj.type = 1;
                        this.http.showModal(AddInvoiceComponent, 'full-screen', obj);
                    }
                    break;
                case 'addQuote':
                    if (data && data.data) {
                        this.http.showModal(AddInvoiceComponent, 'full-screen', data.data);
                    } else {
                        obj.type = 2;
                        this.http.showModal(AddInvoiceComponent, 'full-screen', obj);
                    }
                    break;
                case 'addAddress':
                    this.http.showModal(AddAddressComponent, 'md', data.data);
                    break;
                case 'addProduct':
                    this.http.showModal(AddProductComponent, 'new-md', data.data);
                    break;
                case 'paymentDes':
                    this.http.showModal(PaymentDescriptionComponent, 'more-xs', data.data);
                    break;
                case 'successModal':
                    this.http.showModal(SuccessModalComponent, 'more-xs', data.data);
                    break;
                case 'addPipeline':
                    this.http.showModal(AddPipelineComponent, 'xs', data.data);
                    break;
                case 'addDeal':
                    this.http.showModal(AddDealComponent, 'more-sm', data.data);
                    break;
                case 'dealDetails':
                    this.http.showModal(DealDetailsComponent, 'md', data.data);
                    break;
                case 'moveDeal':
                    this.http.showModal(MoveDealModalComponent, 'md', data.data);
                    break;
                case 'addPipelineTask':
                    this.http.showModal(AddPipelineTaskComponent, 'md', data.data);
                    break;
                case 'autoConfig':
                    this.http.showModal(AutoConfigComponent, 'md', data.data);
                    break;
                case 'cancelConfirm':
                    this.http.showModal(CancelConfirmComponent, 'xs', data.data);
                    break;
                case 'appointBook':
                    this.http.showModal(AppointBookComponent, 'more-lg', data.data);
                    break;
                case 'addAppoint':
                    this.http.showModal(AddAppointmentComponent, 'full-screen', data.data);
                    break;
                case 'dealNote':
                    this.http.showModal(DealNoteComponent, 'md', data.data);
                    break;
                case 'addTag':
                    this.http.showModal(AddTagComponent, 'more-sm', data.data);
                    break;
                case 'appointSuccess':
                    this.http.showModal(AppointSuccessComponent, 'more-sm', data.data);
                    break;
                // case 'changePassword':
                //     this.http.showModal(ChangePasswordComponent, 'more-sm');
                //     break;
                case 'createWorkspace':
                    this.http.showModal(CreateWorkspaceComponent, 'md');
                    break;
                case 'merge-contacts':
                    this.http.showModal(MergeContactsComponent, 'md');
                    break;
                // case 'submitfeedback':
                //     this.http.showModal(SubmitfeedbackComponent, 'md');
                //     break;
               
            }
        }
    }

}
