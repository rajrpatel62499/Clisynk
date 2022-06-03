import {Component, OnInit} from '@angular/core';
import {FormGroup, Validators} from '@angular/forms';
import {HttpService} from '../../../services/http.service';
import {TableModel} from '../../models/table.common.model';
import {ApiUrl} from '../../../services/apiUrls';
import {Subject} from 'rxjs';
import {EditDealNoteComponent} from '../edit-deal-note/edit-deal-note.component';

@Component({
    selector: 'app-deal-note',
    templateUrl: './deal-note.component.html'
})
export class DealNoteComponent implements OnInit {

    form: FormGroup;
    myModel: any;
    modalData: any;
    dealNotes: any = [];
    loader = false;

    constructor(public http: HttpService) {
        this.myModel = new TableModel();
    }

    ngOnInit(): void {
        this.formInit();
        this.dealNoteList(true);
    }

    formInit() {
        this.form = this.http.fb.group({
            text: ['', Validators.required],
            name: [this.modalData.deal.name]
        });
    }

    finalSubmit() {
        if (this.http.isFormValid(this.form)) {
            this.loader = true;
            const obj: any = {
                text: this.form.value.text,
                dealId: this.modalData.deal._id
            };
            this.form.controls.text.patchValue('');
            this.form.controls.text.markAsUntouched();
            this.http.postData(ApiUrl.ADD_DEAL_NOTE, obj).subscribe(() => {
                this.loader = false;
                this.http.openSnackBar('Note Added Successfully');
                this.dealNoteList();
            }, () => {
            });
        }
    }

    goBack() {
        this.http.hideModal();
        this.http.openModal('dealDetails', this.modalData);
    }

    openEditNote(data) {
        this.http.hideModal();
        this.modalData.note = data;
        const modalRef = this.http.showModal(EditDealNoteComponent, 'md', this.modalData);
        modalRef.content.onClose = new Subject<boolean>();
        modalRef.content.onClose.subscribe();
    }

    dealNoteList(loader?) {
        this.myModel.loader = loader;
        this.http.getData(ApiUrl.DEAL_NOTES, {dealId: this.modalData.deal._id}).subscribe(res => {
            this.dealNotes = res.data;
            this.myModel.loader = false;
        });
    }

}
