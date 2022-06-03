import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {HttpService} from '../../../services/http.service';
import {TableModel} from '../../models/table.common.model';
import {ApiUrl} from '../../../services/apiUrls';
import {Subject} from 'rxjs';
import {ContactDetailsComponent} from '../contact-details/contact-details.component';
import * as _ from 'lodash';
import {AddContactToDealComponent} from '../add-contact-to-deal/add-contact-to-deal.component';
import {DealNoteComponent} from '../deal-note/deal-note.component';
import {SendEmailComponent} from '../send-email/send-email.component';

@Component({
    selector: 'app-deal-details',
    templateUrl: './deal-details.component.html'
})
export class DealDetailsComponent implements OnInit {

    form: FormGroup;
    allData;
    myModel: any;
    modalData: any;
    public onClose: Subject<boolean>;
    isSelected = false;
    isEdit = false;
    closeDate = new FormControl(new Date());
    dealActivity = this.http.CONSTANT.dealActivity;
    dealData: any = {};
    myDropDownData: any = {};
    nextData: any = '';

    constructor(public http: HttpService) {
        this.myModel = new TableModel();
    }

    ngOnInit(): void {
        this.formInit();
        if (this.modalData.deal) {
            this.isEdit = true;
            this.fillValues();
        } else {
            this.pipelineList();
        }

    }

    finalSubmit() {
        const obj: any = JSON.parse(JSON.stringify(this.form.value));
        if (this.form.value.contactId.length) {
            obj.contactId = JSON.stringify(this.http.getIdsOnly(this.form.value.contactId));
        }
        if (this.isEdit) {
            obj.taskId = this.modalData._id;
        }
        if (this.http.isFormValid(this.form)) {
            this.http.hideModal();
            this.http.postData(ApiUrl.ADD_DEAL, obj).subscribe(() => {
                if (this.isEdit) {
                    this.http.openSnackBar('Deal Updated Successfully');
                } else {
                    this.http.openSnackBar('Deal Added Successfully');
                }
                this.http.eventSubject.next({eventType: 'addDeal'});
            }, () => {
            });
        }
    }

    formInit() {
        this.form = this.http.fb.group({
            contactId: ['', Validators.required],
            notes: [''],
            name: ['', Validators.required],
            dealValue: [undefined, Validators.required],
            closeDate: [new Date(), Validators.required],
            stageId: [this.modalData._id],
            pipelineId: [this.modalData.pipelineId]
        });
    }

    fillValues() {
        this.form.patchValue({
            name: this.modalData.deal.name,
            dealValue: this.modalData.deal.dealValue
        });
        this.http.getData(ApiUrl.DEAL_DETAILS, {dealId: this.modalData.deal._id}).subscribe(res => {
            this.dealData = res.data;
            if (this.dealData.closeDate) {
                this.form.controls.closeDate.patchValue(new Date(this.dealData.closeDate));
            }
            this.pipelineList();
        });
    }

    closeDateChanged() {
        const obj: any = {
            closeDate: this.form.value.closeDate
        };
        this.dealUpdatedApi(obj);
    }

    onblurFun(name, val) {
        if (val) {
            const obj: any = {};
            obj[name] = val;
            this.dealUpdatedApi(obj, true);
        }
    }

    deleteDeal(template) {
        this.http.showModal(template, 'xs');
    }

    finalDelete() {
        const obj: any = {
            stageId: this.modalData.deal.stageId,
            dealId: this.modalData.deal._id
        };
        this.http.hideModal();
        this.http.postData(ApiUrl.DELETE_DEAL, obj).subscribe(() => {
            this.http.hideModal();
            this.http.openSnackBar('Deal Deleted Successfully');
            this.http.eventSubject.next({eventType: 'addDeal'});
        });
    }

    pipelineList() {
        this.http.getData(ApiUrl.PIPELINES, {}).subscribe(res => {
            this.myModel.pipelines = res.data;
            this.checkGotoNext();
        });
    }

    checkGotoNext() {
        this.myModel.pipelines.forEach(val => {
            if (val._id === this.dealData.pipelineId._id) {
                if (val.stages.length > 1) {
                    const that = this;
                    const myIndex = _.findIndex(val.stages, function (o: any) {
                        return o._id === that.dealData.stageId._id;
                    });
                    if (myIndex > -1) {
                        if (myIndex < val.stages.length) {
                            this.nextData = true;
                        } else {
                            this.nextData = false;
                        }
                    }
                }
            }
        });
    }

    optionSelected(data) {
        const obj: any = {
            pipelineId: data.selectedPipe._id,
            movedTo: data.selectedStage._id,
            movedFrom: this.dealData.stageId._id,
            dealId: this.modalData.deal._id
        };
        this.moveDealApi(obj);
    }

    moveDealApi(obj) {
        this.http.postData(ApiUrl.MOVE_DEAL, obj).subscribe(() => {
            this.http.eventSubject.next({eventType: 'addDeal'});
            this.fillValues();
        });
    }

    dropDownData(data) {
        this.myDropDownData = data;
    }

    removeFromDeal(index) {
        this.modalData.deal.contactId.splice(index, 1);
        this.dealData.contactId.splice(index, 1);
        const obj: any = {
            contactId: JSON.stringify(this.http.getIdsOnly(this.modalData.deal.contactId))
        };
        this.dealUpdatedApi(obj);
    }

    dealUpdatedApi(obj, updated?) {
        obj.dealId = this.modalData.deal._id;
        this.http.postData(ApiUrl.ADD_DEAL, obj).subscribe(() => {
            if (updated) {
                this.http.eventSubject.next({eventType: 'addDeal'});
            } else {
                this.http.openSnackBar('Deal updated successfully');
            }
        });
    }

    openContact(data) {
        this.http.hideModal();
        this.http.showModal(ContactDetailsComponent, 'md', data);
    }

    moveToNext() {
        const obj: any = {
            pipelineId: this.dealData.pipelineId._id,
            movedTo: this.nextData._id,
            movedFrom: this.dealData.stageId._id,
            dealId: this.dealData._id
        };
        this.dealData.stageId = this.nextData;
        this.moveDealApi(obj);
        this.http.hideModal();
    }

    openContactToDeal() {
        this.http.hideModal();
        this.http.showModal(AddContactToDealComponent, 'md', this.modalData);
    }

    openNotes() {
        this.http.hideModal();
        this.http.showModal(DealNoteComponent, 'md', this.modalData);
    }

    openSendEmail() {
        this.http.hideModal();
        this.dealData.openFrom = 'deal';
        this.http.showModal(SendEmailComponent, 'md', this.dealData);
    }

}
