import { ImportedEmailViewComponent } from './../modals/imported-email-view/imported-email-view.component';

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GoogleplaceDirective } from '../directives/googlePlaces.directive';
import { BsDatepickerModule, TimepickerModule } from 'ngx-bootstrap';
import { TimeAgoPipe } from 'time-ago-pipe';
import {
    ModalModule, TabsModule, PaginationModule, BsDropdownModule, CollapseModule, AccordionModule, PopoverModule
} from 'ngx-bootstrap';
import { SharedComponent } from './shared.component';
import {
    MatSliderModule, MatInputModule, MatSelectModule, MatTableModule, MatPaginatorModule,
    MatTabsModule, MatAutocompleteModule, MatIconModule, MatSnackBarModule, MatNativeDateModule,
    MatButtonToggleModule, MatStepperModule, MatCheckboxModule, MatDatepickerModule, MatTooltipModule, MatSortModule
} from '@angular/material';
import { AddContactComponent } from '../modals/add-contact/add-contact.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
// import {ChangePasswordComponent} from '../modals/change-password/change-password.component';
import { ContactDetailsComponent } from '../modals/contact-details/contact-details.component';
import { SendEmailComponent } from '../modals/send-email/send-email.component';
import { CKEditorModule } from 'ng2-ckeditor';
import { EmailFormatComponent } from '../modals/email-format/email-format.component';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import { LoaderComponent } from '../modals/loader/loader.component';
import { AddNoteComponent } from '../modals/add-note/add-note.component';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { ContactDetailComponent } from '../components/contact-detail/contact-detail.component';
import { ContactOptionsComponent } from '../modals/contact-options/contact-options.component';
import { AddTaskComponent } from '../modals/add-task/add-task.component';
import { ActivityListComponent } from '../modals/activity-list/activity-list.component';
import { ImportContactComponent } from '../modals/import-contact/import-contact.component';
import { ReviewPopupComponent } from '../modals/review-popup/review-popup.component';
import { NoteListComponent } from '../modals/note-list/note-list.component';
import { EditNoteComponent } from '../modals/edit-note/edit-note.component';
import { DeleteComponent } from '../modals/delete/delete.component';
import { ContactFilterComponent } from '../modals/contact-filter/contact-filter.component';
import { EmailDetailComponent } from '../modals/email-detail/email-detail.component';
import { ContactListsComponent } from '../modals/contact-lists/contact-lists.component';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { PlaceholdersComponent } from '../modals/placeholders/placeholders.component';
import { LogoutComponent } from '../modals/logout/logout.component';
import { UploadComponent } from '../modals/upload/upload.component';
import { EmailTemplateComponent } from '../modals/email-template/email-template.component';
import { AddRemoveTagComponent } from '../modals/add-remove-tag/add-remove-tag.component';
import { AddTagComponent } from '../modals/add-tag/add-tag.component';
import { AddTagCategoryComponent } from '../modals/add-tag-category/add-tag-category.component';
import { TaskListComponent } from '../modals/task-list/task-list.component';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { ClickOutsideModule } from 'ng-click-outside';
import { TagInputModule } from 'ngx-chips';
import { AddPaymentComponent } from '../modals/add-payment/add-payment.component';
import { AddInvoiceComponent } from '../modals/add-invoice/add-invoice.component';
import { AddProductComponent } from '../modals/add-product/add-product.component';
import { AddAppointmentComponent } from '../modals/add-appointment/add-appointment.component';
import { AddAddressComponent } from '../modals/add-address/add-address.component';
import { InvoiceTabsComponent } from '../modals/invoice-tabs/invoice-tabs.component';
import { PaymentDescriptionComponent } from '../modals/payment-description/payment-description';
import { SuccessModalComponent } from '../modals/success-modal/success-modal.component';
import { CopyClipboardDirective } from '../directives/copy.directive';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { AddPipelineComponent } from '../modals/add-pipeline/add-pipeline.component';
import { ManagePipelineComponent } from '../modals/manage-pipeline/manage-pipeline.component';
import { AddDealComponent } from '../modals/add-deal/add-deal.component';
import { NumberOnlyDirective } from '../directives/numberOnly.directive';
import { DealDetailsComponent } from '../modals/deal-details/deal-details.component';
import { MoveDealModalComponent } from '../modals/move-deal-modal/move-deal-modal.component';
import { AutoConfigComponent } from '../modals/auto-config/auto-config.component';
import { ContactPipelineComponent } from '../modals/contact-pipeline/contact-pipeline.component';
import { FirstCharacterPipe } from '../pipes/firstCharacter.pipe';
import { AddContactToDealComponent } from '../modals/add-contact-to-deal/add-contact-to-deal.component';
import { DealNoteComponent } from '../modals/deal-note/deal-note.component';
import { EditDealNoteComponent } from '../modals/edit-deal-note/edit-deal-note.component';
import { AddPipelineTaskComponent } from '../modals/add-pipeline-task/add-pipeline-task.component';
import { PipelineSendEmailComponent } from '../modals/pipeline-send-email/pipeline-send-email.component';
import { CancelConfirmComponent } from '../modals/cancel-confirm/cancel-confirm.component';
import { AppointBookComponent } from '../modals/appoint-book/appoint-book.component';
import { AppointStep1Component } from '../modals/appoint-step-1/appoint-step-1.component';
import { AppointStep2Component } from '../modals/appoint-step-2/appoint-step-2.component';
import { AppointStep3Component } from '../modals/appoint-step-3/appoint-step-3.component';
import { AppointStep4Component } from '../modals/appoint-step-4/appoint-step-4.component';
import { EditAppointmentComponent } from '../modals/edit-appointment/edit-appointment.component';
import { CalSlotComponent } from '../modals/cal-slot/cal-slot.component';
import { FullCalendarModule } from '@fullcalendar/angular';
import { ChangeTimePipe } from '../pipes/time.pipe';
import { BookModalComponent } from '../modals/book-modal/book-modal.component';
import { ConfirmComponent } from '../modals/confirm/confirm.component';
import { AppointTypeListComponent } from '../modals/appoint-type-list/appoint-type-list.component';
import { AppointListComponent } from '../modals/appoint-list/appoint-list.component';
import { AppointSuccessComponent } from '../modals/appoint-success/appoint-success.component';
import { AddUserComponent } from '../modals/add-user/add-user.component';
import { ColorPickerModule } from 'ngx-color-picker';
import { NotificationsComponent } from '../modals/notifications/notifications.component';
import { DeleteContactComponent } from '../modals/delete-contact/delete-contact.component';
import { chatGroupUsernamePipe } from '../pipes/chatGroupUsername.pipe';

import { environment } from '../../../environments/environment';
// import { SubmitfeedbackComponent } from '../modals/submitfeedback/submitfeedback.component';
import { SmartFormCreateComponent } from '../modals/smart-form-create/smart-form-create.component';
import { FormioModule } from 'angular-formio';
import { CreateWorkspaceComponent } from '../modals/create-workspace/create-workspace.component';
import { MergeContactsComponent } from '../modals/merge-contacts/merge-contacts.component';
import { SmartFormDeleteComponent } from '../modals/smart-form-delete/smart-form-delete.component';
import { LeadFormCreateComponent } from '../modals/lead-form-create/lead-form-create.component';
import { RxReactiveFormsModule } from "@rxweb/reactive-form-validators"
import { ForgotPasswordComponent } from '../modals/forgot-password/forgot-password.component';
import { DeleteDocComponent } from '../modals/delete-doc/delete-doc.component';
import { MoveComponent } from '../modals/move/move.component';
import { CreateDocumentComponent } from './../modals/create-document/create-document.component';
import { AddPageComponent } from './../modals/add-page/add-page.component';
import { CreateFolderComponent } from './../modals/create-folder/create-folder.component';
import { EmailDocumentFormatComponent } from './../modals/email-document-format/email-document-format.component';
import { NgxSummernoteModule } from 'ngx-summernote';
import { PDFExportModule } from '@progress/kendo-angular-pdf-export';

// Automation Module Modals components.
import { NavigateToAppointmentComponent } from '../modals/navigate-to-appointment/navigate-to-appointment.component';
import { NavigateToLeadFormsComponent } from '../modals/navigate-to-lead-forms/navigate-to-lead-forms.component';
import { NavigateToProductsComponent } from '../modals/navigate-to-products/navigate-to-products.component';
import { NavigateToTagsComponent } from '../modals/navigate-to-tags/navigate-to-tags.component';
import { RenameAutomationComponent } from 'src/app/shared/modals/rename-automation/rename-automation.component';
import { LeadFormDeletedComponent } from 'src/app/shared/modals/lead-form-deleted/lead-form-deleted.component';
import { DeleteAutomationComponent } from 'src/app/shared/modals/delete-automation/delete-automation.component';
import { EditWorkspaceComponent } from 'src/app/internal/settings/edit-workspace/edit-workspace.component';
import { InputRestrictionDirective } from '../directives/InputRestrictionDirective.directive';
import { StringToObjPipe } from '../pipes/stringToObj.pipe';

import { AvatarModule } from 'ngx-avatar';
import { NewEditTaskComponent } from '../modals/new-edit-task/new-edit-task.component';
import { MatSidenavModule } from '@angular/material/sidenav';
import { SaveTemplateComponent } from '../modals/save-template/save-template.component';
import { DynamicHTMLModule } from 'src/app/internal/broadcast/edit-code/dynamic-html/module';
import { AngularEditorModule } from '@kolkov/angular-editor';
import { NgxCsvParserModule } from 'ngx-csv-parser';
import { SuccessBroadcastModalComponent } from '../modals/success-broadcast-modal/success-broadcast-modal.component';
import { PreviewInvoiceComponent } from '../modals/preview-invoice/preview-invoice.component';

const entryList = [EmailFormatComponent, SendEmailComponent, ContactDetailsComponent, AddNoteComponent,
    ContactOptionsComponent, AddTaskComponent, LoaderComponent, ContactDetailComponent, ActivityListComponent, ContactFilterComponent,
    ImportContactComponent, ReviewPopupComponent, AddContactComponent, NoteListComponent, EditNoteComponent, DeleteComponent,
    EmailDetailComponent, ContactListsComponent, PlaceholdersComponent, LogoutComponent, CancelConfirmComponent,
    UploadComponent, EmailTemplateComponent, AddRemoveTagComponent, AddTagComponent, AddTagCategoryComponent, TaskListComponent,
    AddPaymentComponent, AddInvoiceComponent, AddProductComponent, AddAppointmentComponent, AddAddressComponent,
    InvoiceTabsComponent, PaymentDescriptionComponent, SuccessModalComponent, AddPipelineComponent, ManagePipelineComponent,
    AddDealComponent, DealDetailsComponent, MoveDealModalComponent, AutoConfigComponent, ContactPipelineComponent,
    AddContactToDealComponent, DealNoteComponent, ForgotPasswordComponent, EditDealNoteComponent, AddPipelineTaskComponent, PipelineSendEmailComponent,
    AppointBookComponent, AppointStep1Component, AppointStep2Component, AppointStep3Component, AppointStep4Component,
    EditAppointmentComponent, CalSlotComponent, BookModalComponent, ConfirmComponent, AppointTypeListComponent,
    AppointListComponent, AppointSuccessComponent, AddUserComponent, NotificationsComponent, DeleteContactComponent,
    SmartFormCreateComponent, CreateWorkspaceComponent, MergeContactsComponent, SmartFormDeleteComponent, LeadFormCreateComponent,
    CreateFolderComponent, AddPageComponent, CreateDocumentComponent, DeleteDocComponent, MoveComponent, EmailDocumentFormatComponent,
    DeleteAutomationComponent, LeadFormDeletedComponent, NavigateToLeadFormsComponent, NavigateToAppointmentComponent, NavigateToTagsComponent,
    NavigateToProductsComponent, RenameAutomationComponent, EditWorkspaceComponent, NewEditTaskComponent, SaveTemplateComponent,
    ImportedEmailViewComponent,SuccessBroadcastModalComponent, PreviewInvoiceComponent
];

const importExportList = [MatStepperModule, MatTabsModule, MatSliderModule, MatInputModule, MatSelectModule,
    MatTableModule, MatPaginatorModule, MatAutocompleteModule, MatIconModule, MatButtonToggleModule, CKEditorModule,
    ReactiveFormsModule, FormsModule, MatCheckboxModule, NgxSkeletonLoaderModule, MatSnackBarModule, ScrollingModule,
    Ng2SearchPipeModule, MatDatepickerModule, MatNativeDateModule, ClickOutsideModule, TagInputModule, DragDropModule,
    FullCalendarModule, ColorPickerModule, FormioModule, RxReactiveFormsModule, MatTooltipModule, MatSortModule, PDFExportModule,
    AvatarModule, MatSidenavModule,AngularEditorModule, NgxCsvParserModule 

];

@NgModule({
    imports: [
        NgMultiSelectDropDownModule.forRoot(), BsDatepickerModule.forRoot(), TimepickerModule.forRoot(),
        CommonModule, PaginationModule.forRoot(), BsDropdownModule.forRoot(), TabsModule.forRoot(),
        ModalModule.forRoot(), CollapseModule.forRoot(), AccordionModule.forRoot(), PopoverModule.forRoot(),
        NgxSummernoteModule,
        DynamicHTMLModule.forRoot({components: []}),


        ...importExportList
    ],
    declarations: [FirstCharacterPipe, CopyClipboardDirective, GoogleplaceDirective, TimeAgoPipe, NumberOnlyDirective, InputRestrictionDirective,
        SharedComponent, ChangeTimePipe, StringToObjPipe, chatGroupUsernamePipe, ...entryList],
    exports: [
        CopyClipboardDirective, SharedComponent, TimepickerModule, BsDatepickerModule, GoogleplaceDirective,
        PaginationModule, BsDropdownModule, TabsModule, ModalModule, CollapseModule, AccordionModule, TimeAgoPipe,
        CommonModule, ...importExportList, ...entryList, NgMultiSelectDropDownModule, FirstCharacterPipe,
        ChangeTimePipe, StringToObjPipe, NumberOnlyDirective, chatGroupUsernamePipe, InputRestrictionDirective,
        DynamicHTMLModule
    ],
    entryComponents: [...entryList]
})
export class SharedModule {
}
