import {Component, OnInit} from '@angular/core';
import {FormGroup, Validators} from '@angular/forms';
import {HttpService} from '../../../services/http.service';
import {ApiUrl} from '../../../services/apiUrls';

@Component({
    selector: 'app-edit-deal-note',
    templateUrl: './edit-deal-note.component.html'
})
export class EditDealNoteComponent implements OnInit {

    form: FormGroup;
    modalData: any;
    contacts: any = [];
    obj: any = {};
    loader = '';

    constructor(public http: HttpService) {
    }

    ngOnInit(): void {
        this.formInit();
        this.obj.noteId = this.modalData.note._id;
        this.obj.dealId = this.modalData.deal._id;
    }

    formInit() {
        this.form = this.http.fb.group({
            text: [this.modalData.note.text, Validators.required]
        });
    }

    finalSubmit() {
        if (this.http.isFormValid(this.form)) {
            this.obj.text = this.form.value.text;
            this.loader = 'save';
            this.http.postData(ApiUrl.ADD_DEAL_NOTE, this.obj).subscribe(() => {
                this.http.openSnackBar('Note updated Successfully');
                this.goBack();
            }, () => {
            });
        }
    }

    deleteFun() {
        const obj: any = {
            dealId: this.modalData.deal._id,
            noteId: this.modalData.note._id
        };
        this.loader = 'delete';
        this.http.postData(ApiUrl.DELETE_DEAL_NOTES, obj).subscribe(() => {
            this.http.openSnackBar('Deleted Successfully');
            this.goBack();
        });
    }

    goBack() {
        this.http.hideModal();
        this.http.showModal('dealNote', this.modalData);
    }

}
